import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractNutrition } from "../src/ocr.js";

describe("extractNutrition", () => {
  test("AC1: extracts all nutritional values from OCR results", () => {
    const ocrResults = {
      energy: "250 kcal",
      fats: "10g",
      saturatedFats: "3g",
      carbs: "30g",
      sugars: "12g",
      fiber: "2g",
      protein: "8g",
      salt: "0.5g"
    };

    const result = extractNutrition(ocrResults);

    assert.strictEqual(result.energy, 250);
    assert.strictEqual(result.fats, 10);
    assert.strictEqual(result.saturatedFats, 3);
    assert.strictEqual(result.carbs, 30);
    assert.strictEqual(result.sugars, 12);
    assert.strictEqual(result.fiber, 2);
    assert.strictEqual(result.protein, 8);
    assert.strictEqual(result.salt, 0.5);
  });

  test("AC2: returns zeros for missing values", () => {
    const ocrResults = {
      energy: "250 kcal",
      // fats, saturatedFats, carbs, sugars, fiber, protein, salt are missing
    };

    const result = extractNutrition(ocrResults);

    assert.strictEqual(result.energy, 250);
    assert.strictEqual(result.fats, 0);
    assert.strictEqual(result.saturatedFats, 0);
    assert.strictEqual(result.carbs, 0);
    assert.strictEqual(result.sugars, 0);
    assert.strictEqual(result.fiber, 0);
    assert.strictEqual(result.protein, 0);
    assert.strictEqual(result.salt, 0);
  });

  test("AC3: returns all zeros for null/undefined input", () => {
    assert.deepStrictEqual(extractNutrition(null), {
      energy: 0,
      fats: 0,
      saturatedFats: 0,
      carbs: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      salt: 0
    });

    assert.deepStrictEqual(extractNutrition(undefined), {
      energy: 0,
      fats: 0,
      saturatedFats: 0,
      carbs: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      salt: 0
    });
  });

  test("AC4: handles malformed values by returning 0", () => {
    const ocrResults = {
      energy: "not a number kcal",
      fats: "abcg",
      saturatedFats: "3g",
      carbs: "30g",
      sugars: "12g",
      fiber: "2g",
      protein: "8g",
      salt: "0.5g"
    };

    const result = extractNutrition(ocrResults);

    assert.strictEqual(result.energy, 0);
    assert.strictEqual(result.fats, 0);
    assert.strictEqual(result.saturatedFats, 3);
    assert.strictEqual(result.carbs, 30);
    assert.strictEqual(result.sugars, 12);
    assert.strictEqual(result.fiber, 2);
    assert.strictEqual(result.protein, 8);
    assert.strictEqual(result.salt, 0.5);
  });

  test("AC5: handles empty string values", () => {
    const ocrResults = {
      energy: "",
      fats: "",
      saturatedFats: "",
      carbs: "",
      sugars: "",
      fiber: "",
      protein: "",
      salt: ""
    };

    const result = extractNutrition(ocrResults);

    assert.strictEqual(result.energy, 0);
    assert.strictEqual(result.fats, 0);
    assert.strictEqual(result.saturatedFats, 0);
    assert.strictEqual(result.carbs, 0);
    assert.strictEqual(result.sugars, 0);
    assert.strictEqual(result.fiber, 0);
    assert.strictEqual(result.protein, 0);
    assert.strictEqual(result.salt, 0);
  });

  test("AC6: handles values with extra whitespace", () => {
    const ocrResults = {
      energy: "  250 kcal  ",
      fats: "  10g  ",
      saturatedFats: "  3g  ",
      carbs: "  30g  ",
      sugars: "  12g  ",
      fiber: "  2g  ",
      protein: "  8g  ",
      salt: "  0.5g  "
    };

    const result = extractNutrition(ocrResults);

    assert.strictEqual(result.energy, 250);
    assert.strictEqual(result.fats, 10);
    assert.strictEqual(result.saturatedFats, 3);
    assert.strictEqual(result.carbs, 30);
    assert.strictEqual(result.sugars, 12);
    assert.strictEqual(result.fiber, 2);
    assert.strictEqual(result.protein, 8);
    assert.strictEqual(result.salt, 0.5);
  });
});