import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResponse, Verdict } from "../types";

export const analyzeClaim = async (content: string, imageBase64?: string): Promise<AnalysisResponse & { sources: any[] }> => {
  // Use a new instance right before calling the API to ensure latest configuration.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are the TruthGuard Neural Engine. You analyze content for misinformation with surgical precision.
    STRICT RULES:
    1. Identify logical fallacies (e.g., Strawman, Appeal to Emotion, Gaslighting).
    2. Provide a 3-4 step reasoning path of how you verified the data.
    3. If an image is present, perform a forensic analysis.
    4. Use Google Search to find current grounding for the claim.
    5. RETURN ONLY VALID JSON.
  `;

  const parts: any[] = [];
  if (content) parts.push({ text: content });
  if (!content && !imageBase64) parts.push({ text: "Provide a global state summary of disinformation." });
  
  if (imageBase64) {
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
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
            confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
            explanation: { type: Type.STRING },
            claims_identified: { type: Type.ARRAY, items: { type: Type.STRING } },
            fallacies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Logical fallacies found." },
            reasoning_steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step reasoning." }
          },
          required: ["verdict", "confidence", "explanation"]
        }
      },
    });

    // Accessing the generated text directly through the .text property as per guidelines.
    const resultText = response.text || '{}';
    const result = JSON.parse(resultText);
    
    // Extract website URLs from groundingChunks as required by Google Search grounding rules.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || 'Grounding Reference',
      uri: chunk.web?.uri || '#'
    })).filter((s: any) => s.uri !== '#');

    return { ...result, sources };
  } catch (error) {
    console.error("Neural Analysis Core Failure:", error);
    throw new Error("Neural Link Interrupt: Disinformation density too high or connection timeout.");
  }
};