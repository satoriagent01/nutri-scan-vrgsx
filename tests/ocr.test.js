import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractNutrition } from "../src/ocr.js";

describe("extractNutrition", () => {
  test("AC-1: extracts energy from OCR result", () => {
    const result = extractNutrition({
      energy: "2292 kJ / 549 kcal"
    });
    assert.strictEqual(result.energy, { kj: 2292, kcal: 549 });
  });

  test("AC-2: extracts fats from OCR result", () => {
    const result = extractNutrition({
      fats: "33 g"
    });
    assert.strictEqual(result.fats, 33);
  });

  test("AC-3: extracts saturated fats from OCR result", () => {
    const result = extractNutrition({
      saturatedFats: "13 g"
    });
    assert.strictEqual(result.saturatedFats, 13);
  });

  test("AC-4: extracts carbohydrates from OCR result", () => {
    const result = extractNutrition({
      carbohydrates: "55 g"
    });
    assert.strictEqual(result.carbohydrates, 55);
  });

  test("AC-5: extracts sugars from OCR result", () => {
    const result = extractNutrition({
      sugars: "45 g"
    });
    assert.strictEqual(result.sugars, 45);
  });

  test("AC-6: extracts fiber from OCR result", () => {
    const result = extractNutrition({
      fiber: "2.4 g"
    });
    assert.strictEqual(result.fiber, 2.4);
  });

  test("AC-7: extracts protein from OCR result", () => {
    const result = extractNutrition({
      protein: "6.8 g"
    });
    assert.strictEqual(result.protein, 6.8);
  });

  test("extracts salt from OCR result", () => {
    const result = extractNutrition({
      salt: "0.18 g"
    });
    assert.strictEqual(result.salt, 0.18);
  });

  test("returns all fields when all are present", () => {
    const result = extractNutrition({
      energy: "2292 kJ / 549 kcal",
      fats: "33 g",
      saturatedFats: "13 g",
      carbohydrates: "55 g",
      sugars: "45 g",
      fiber: "2.4 g",
      protein: "6.8 g",
      salt: "0.18 g"
    });
    assert.deepStrictEqual(result, {
      energy: { kj: 2292, kcal: 549 },
      fats: 33,
      saturatedFats: 13,
      carbohydrates: 55,
      sugars: 45,
      fiber: 2.4,
      protein: 6.8,
      salt: 0.18
    });
  });
});