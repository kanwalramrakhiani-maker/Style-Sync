import { GoogleGenAI, Type } from "@google/genai";
import { AccessoryItem, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface Suggestion {
  itemIds: string[];
  reasoning: string;
  matchedItems: { id: string; name: string; category: Category }[];
}

export async function getOutfitSuggestion(
  closet: AccessoryItem[],
  shirtColor: string,
  occasion: string,
  outfitDescription?: string
): Promise<Suggestion> {
  // Simplified closet info for AI
  const closetSummary = closet.map(item => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    color: item.color,
    category: item.category,
    tags: item.tags
  }));

  const prompt = `
    I am a fashion stylist for a luxury accessory management platform.
    The user is wearing a ${shirtColor} shirt/top ${outfitDescription ? `and ${outfitDescription}` : ''}.
    The occasion is ${occasion}.
    
    Choose exactly ONE accessory from EACH of these categories if applicable from the user's closet: 
    Watches, Sunglasses, Bags, Bracelets.
    
    User's Closet:
    ${JSON.stringify(closetSummary)}

    Return a suggestion that matches the color palette and occasion perfectly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The IDs of the recommended items from the provided closet."
            },
            reasoning: {
              type: Type.STRING,
              description: "A short premium explanation of why these colors and styles match."
            }
          },
          required: ["itemIds", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    const matchedItems = result.itemIds.map((id: string) => {
      const item = closet.find(i => i.id === id);
      return item ? { id: item.id, name: item.name, category: item.category } : null;
    }).filter(Boolean);

    return {
      ...result,
      matchedItems
    };
  } catch (error) {
    console.error("AI Error:", error);
    // Fallback logic if AI fails or key is missing
    return {
      itemIds: [],
      reasoning: "We encountered an issue styling your look. Try again soon.",
      matchedItems: []
    };
  }
}
