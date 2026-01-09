
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, Verdict } from "../types";

export const analyzeClaim = async (content: string, imageBase64?: string): Promise<AnalysisResponse & { sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are the TruthGuard Neural Engine. You analyze content for misinformation with surgical precision.
    1. Identify logical fallacies (e.g., Strawman, Gaslighting, False Dilemma).
    2. Provide a step-by-step reasoning path of how you verified the data.
    3. If an image is present, look for forensic inconsistencies.
    4. Use Google Search to ground your findings in reality.
    STRICT JSON OUTPUT.
  `;

  const parts: any[] = [{ text: content || "Analyze this content for misinformation." }];
  
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64.split(',')[1] || imageBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ parts }],
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: Object.values(Verdict) },
            confidence: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            claims_identified: { type: Type.ARRAY, items: { type: Type.STRING } },
            fallacies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Logical fallacies found in the content." },
            reasoning_steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Steps taken to verify the claim." }
          },
          required: ["verdict", "confidence", "explanation", "claims_identified"]
        }
      },
    });

    const result = JSON.parse(response.text || '{}');
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || 'Verified Source',
      uri: chunk.web?.uri || '#'
    })).filter((s: any) => s.uri !== '#');

    return { ...result, sources };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Neural link unstable. High misinformation density detected.");
  }
};
