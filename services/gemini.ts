
import { GoogleGenAI, Type } from "@google/genai";
import { ImageSize, Recipe, Language, UserProfile } from "../types";

// Helper for AI Studio Key Selection
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

const ensureApiKey = async () => {
  const aistudio = (window as any).aistudio as AIStudio | undefined;
  if (aistudio) {
    const hasKey = await aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await aistudio.openSelectKey();
    }
  }
};

const getClient = () => {
  // Check specifically for window.aistudio usage when doing advanced generation, 
  // but for standard calls we use env key if available, falling back to prompts if needed by the wrapper environment.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Text Generation (Recipes) ---

export const generateRecipes = async (
  ingredients: string,
  preferences: UserProfile,
  language: Language
): Promise<Recipe[]> => {
  const ai = getClient();
  
  // Basic Text Task -> Gemini 2.5 Flash
  const modelId = "gemini-2.5-flash";

  const langContext = language === 'pt' ? 'Portuguese (Brazil)' : 'English';

  const prompt = `
    Create 5 distinct cooking recipes using these ingredients: ${ingredients}.
    
    Language: Generate all content in ${langContext}.
    
    User Profile Context:
    - Name: ${preferences.name || 'User'}
    - Cooking Skill Level: ${preferences.skillLevel} (Adjust difficulty accordingly)
    - Available Appliances: ${preferences.appliances.length > 0 ? preferences.appliances.join(', ') : 'Standard Stove & Oven'}
    - Measurement System: ${preferences.measurementSystem}
    
    Dietary Constraints:
    - Diet: ${preferences.dietaryRestrictions}
    - Allergies (MUST EXCLUDE): ${preferences.allergies.join(', ')}
    
    Preferences:
    - Favorite Cuisines: ${preferences.favoriteCuisines.join(', ')}
    - Favorite Regions (Brazil): ${preferences.favoriteRegions.join(', ')}
    
    Requirements:
    1. If possible, include regional variations based on preferences.
    2. Each recipe must have a title, list of ingredients, and exactly 6 concise steps.
    3. Add an estimated prep time.
    4. Ensure recipes utilize the available appliances if applicable.
    5. Output ONLY JSON.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            cuisine: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  instruction: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }
  });

  if (response.text) {
    const rawRecipes = JSON.parse(response.text);
    return rawRecipes.map((r: any, index: number) => ({
      ...r,
      id: `${Date.now()}-${index}`,
      thumbnailUrl: undefined // Images are generated on demand
    }));
  }
  
  throw new Error("Failed to generate recipes");
};

// --- Image Generation ---

export const generateRecipeImage = async (
  recipe: Recipe,
  size: ImageSize
): Promise<string> => {
  // Ensure user has selected a paid key for this premium model
  await ensureApiKey();

  // Re-initialize client to ensure it picks up the selected key if changed
  const ai = getClient();

  const modelId = "gemini-3-pro-image-preview";
  
  // The prompt uses the recipe title which will now be in the correct language.
  const prompt = `Professional food photography of ${recipe.title}. 
  Ingredients visible: ${recipe.ingredients.slice(0, 3).join(', ')}. 
  High resolution, delicious, restaurant quality lighting, overhead shot.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", // Square for thumbnails
          imageSize: size 
        }
      }
    });

    // Iterate parts to find the image
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Image generation failed:", error);
    // If key error, we might need to re-prompt, but for now throw
    throw error;
  }
};
