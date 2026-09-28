import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Mock localStorage for browser-like environment in Node.js
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, value) => { mockStorage[key] = value; },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// Mock OCR results that would come from a scanning API
const mockOcrResults = {
  energy: "250 kcal",
  fats: "10g",
  saturatedFats: "3g",
  carbs: "35g",
  sugars: "12g",
  fiber: "5g",
  protein: "8g",
  salt: "0.5g"
};

// Simulate the extractNutrition function behavior
function extractNutrition(ocrResults) {
  const parseValue = (value, unit) => {
    if (!value) return 0;
    const num = parseFloat(value.replace(unit, "").trim());
    return isNaN(num) ? 0 : num;
  };

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

describe("OCR Extraction", () => {
  test("extractNutrition should parse all nutritional values from OCR results", () => {
    const result = extractNutrition(mockOcrResults);
    
    assert.strictEqual(result.energy, 250);
    assert.strictEqual(result.fats, 10);
    assert.strictEqual(result.saturatedFats, 3);
    assert.strictEqual(result.carbs, 35);
    assert.strictEqual(result.sugars, 12);
    assert.strictEqual(result.fiber, 5);
    assert.strictEqual(result.protein, 8);
    assert.strictEqual(result.salt, 0.5);
  });

  test("extractNutrition should handle missing values", () => {
    const partialResults = {
      energy: "250 kcal",
      fats: "10g",
      // other fields missing
    };
    
    const result = extractNutrition(partialResults);
    
    assert.strictEqual(result.energy, 250);
    assert.strictEqual(result.fats, 10);
    assert.strictEqual(result.saturatedFats, 0);
    assert.strictEqual(result.carbs, 0);
    assert.strictEqual(result.sugars, 0);
    assert.strictEqual(result.fiber, 0);
    assert.strictEqual(result.protein, 0);
    assert.strictEqual(result.salt, 0);
  });

  test("extractNutrition should handle empty OCR results", () => {
    const result = extractNutrition({});
    
    assert.strictEqual(result.energy, 0);
    assert.strictEqual(result.fats, 0);
    assert.strictEqual(result.saturatedFats, 0);
    assert.strictEqual(result.carbs, 0);
    assert.strictEqual(result.sugars, 0);
    assert.strictEqual(result.fiber, 0);
    assert.strictEqual(result.protein, 0);
    assert.strictEqual(result.salt, 0);
  });

  test("extractNutrition should handle malformed values", () => {
    const malformedResults = {
      energy: "invalid",
      fats: "abcg",
      saturatedFats: "3g",
      carbs: "35g",
      sugars: "12g",
      fiber: "5g",
      protein: "8g",
      salt: "0.5g"
    };
    
    const result = extractNutrition(malformedResults);
    
    assert.strictEqual(result.energy, 0);
    assert.strictEqual(result.fats, 0);
    assert.strictEqual(result.saturatedFats, 3);
    assert.strictEqual(result.carbs, 35);
    assert.strictEqual(result.sugars, 12);
    assert.strictEqual(result.fiber, 5);
    assert.strictEqual(result.protein, 8);
    assert.strictEqual(result.salt, 0.5);
  });
});