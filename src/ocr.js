/**
 * OCR Extraction Module
 * 
 * Sends an image to the user-configured AI endpoint and returns
 * structured nutritional data.
 */

/**
 * Parses a value string and extracts the numeric value with the given unit.
 * @param {string} value - The value string (e.g., "250 kcal", "10g")
 * @param {string} unit - The unit to strip (e.g., "kcal", "g")
 * @returns {number} The parsed numeric value, or 0 if invalid
 */
function parseValue(value, unit) {
  if (!value) return 0;
  const num = parseFloat(value.replace(unit, "").trim());
  return isNaN(num) ? 0 : num;
}

/**
 * Extracts nutritional data from OCR results.
 * 
 * @param {Object} ocrResults - The OCR results object with raw text values
 * @param {string} [ocrResults.energy] - Energy value (e.g., "250 kcal")
 * @param {string} [ocrResults.fats] - Fats value (e.g., "10g")
 * @param {string} [ocrResults.saturatedFats] - Saturated fats value
 * @param {string} [ocrResults.carbs] - Carbohydrates value
 * @param {string} [ocrResults.sugars] - Sugars value
 * @param {string} [ocrResults.fiber] - Fiber value
 * @param {string} [ocrResults.protein] - Protein value
 * @param {string} [ocrResults.salt] - Salt value
 * @returns {Object} Structured nutritional data with numeric values
 */
export function extractNutrition(ocrResults) {
  if (!ocrResults) {
    return {
      energy: 0,
      fats: 0,
      saturatedFats: 0,
      carbs: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      salt: 0
    };
  }

  return {
    energy: parseValue(ocrResults.energy, "kcal"),
    fats: parseValue(ocrResults.fats, "g"),
    saturatedFats: parseValue(ocrResults.saturatedFats, "g"),
    carbs: parseValue(ocrResults.carbs, "g"),
    sugars: parseValue(ocrResults.sugars, "g"),
    fiber: parseValue(ocrResults.fiber, "g"),
    protein: parseValue(ocrResults.protein, "g"),
    salt: parseValue(ocrResults.salt, "g")
  };
}

/**
 * Sends an image to the configured AI endpoint for OCR extraction.
 * 
 * @param {string|Blob|File} imageData - The image data (base64 string, Blob, or File)
 * @param {Object} config - Configuration for the AI endpoint
 * @param {string} config.endpoint - The AI endpoint URL
 * @param {string} config.key - The API key
 * @returns {Promise<Object>} The extracted nutritional data
 */
export async function scanNutrition(imageData, config) {
  if (!config || !config.endpoint || !config.key) {
    throw new Error("AI endpoint configuration is required. Set endpoint and key.");
  }

  let base64Data;
  if (imageData instanceof Blob || imageData instanceof File) {
    base64Data = await blobToBase64(imageData);
  } else if (typeof imageData === "string") {
    base64Data = imageData;
  } else {
    throw new Error("Unsupported image data type");
  }

  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.key}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the nutritional information from this image. Return only a JSON object with these keys: energy (in kcal), fats (in g), saturatedFats (in g), carbs (in g), sugars (in g), fiber (in g), protein (in g), salt (in g). Use numeric values only, no units."
            },
            {
              type: "image_url",
              image_url: {
                url: base64Data.startsWith("data:") ? base64Data : `data:image/png;base64,${base64Data}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error(`AI endpoint error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  // Try to parse JSON from the response
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        energy: String(parsed.energy || ""),
        fats: String(parsed.fats || ""),
        saturatedFats: String(parsed.saturatedFats || ""),
        carbs: String(parsed.carbs || ""),
        sugars: String(parsed.sugars || ""),
        fiber: String(parsed.fiber || ""),
        protein: String(parsed.protein || ""),
        salt: String(parsed.salt || "")
      };
    }
  } catch (e) {
    // If JSON parsing fails, return empty results
  }

  return {
    energy: "",
    fats: "",
    saturatedFats: "",
    carbs: "",
    sugars: "",
    fiber: "",
    protein: "",
    salt: ""
  };
}

/**
 * Converts a Blob to a base64 string.
 * @param {Blob} blob - The blob to convert
 * @returns {Promise<string>} The base64 string
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}