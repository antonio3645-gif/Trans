import { GoogleGenAI, Type } from "@google/genai";
import { Freight } from "../types";

const getAI = () => {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) console.warn("API Key missing");
    return new GoogleGenAI({ apiKey });
}

export const analyzeReceiptImage = async (base64Image: string): Promise<{ amount: number; date: string; description: string; category: string }> => {
  try {
    const ai = getAI();
    // Using gemini-3-flash-preview for multimodal capabilities
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this receipt image. Extract the total amount, the date (in ISO format YYYY-MM-DD), the merchant name as description, and guess the category (Fuel, Food, Toll, Maintenance, Other). 
            Return JSON with keys: amount (number), date (string), description (string), category (string).`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing receipt:", error);
    throw error;
  }
};

export const getFreightInsights = async (freights: Freight[]): Promise<string> => {
  try {
    const ai = getAI();
    const dataSummary = JSON.stringify(freights.map(f => ({
      route: `${f.origin} to ${f.destination}`,
      price: f.price,
      totalExpenses: f.expenses.reduce((acc, e) => acc + e.amount, 0),
      cargo: f.cargo
    })));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a logistics expert assistant. Analyze this freight history JSON: ${dataSummary}.
      Give me a brief, encouraging summary in Portuguese (pt-BR). 
      Highlight the most profitable route and give one tip to improve earnings. 
      Keep it under 3 paragraphs. Use markdown.`
    });

    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Error getting insights:", error);
    return "Erro ao conectar com o assistente inteligente.";
  }
};

export const chatWithAssistant = async (history: { role: 'user' | 'model', text: string }[], newMessage: string, freights: Freight[]) => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      config: {
        systemInstruction: `You are 'FreteBot', a helpful assistant for truck drivers in Brazil.
        You have access to the user's freight data: ${JSON.stringify(freights.slice(0, 5))}.
        Be concise, friendly, and use Portuguese (pt-BR).
        Help with calculations, route advice, or cost estimation.`
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
  } catch (error) {
    console.error("Chat error", error);
    throw error;
  }
};

export const getRouteCoordinates = async (origin: string, destination: string): Promise<{ originLat: number, originLng: number, destLat: number, destLng: number }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify the approximate latitude and longitude coordinates for "${origin}" and "${destination}". 
      Return strictly a JSON object with keys: originLat, originLng, destLat, destLng. All values must be numbers.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originLat: { type: Type.NUMBER },
            originLng: { type: Type.NUMBER },
            destLat: { type: Type.NUMBER },
            destLng: { type: Type.NUMBER },
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new Error("Não foi possível encontrar as coordenadas.");
  }
};