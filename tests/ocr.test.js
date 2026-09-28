import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractNutrition } from "../src/ocr.js";

describe("OCR Extraction", () => {
  test("AC-1: Extracts energy from nutrition label", () => {
    const result = extractNutrition("Energie 2292 kJ / 549 kcal");
    assert.equal(result.energy, 549);
  });

  test("AC-2: Extracts fats from nutrition label", () => {
    const result = extractNutrition("Fett 33 g");
    assert.equal(result.fats, 33);
  });

  test("AC-3: Extracts saturated fats from nutrition label", () => {
    const result = extractNutrition("davon gesättigte Fettsäuren 13 g");
    assert.equal(result.saturatedFats, 13);
  });

  test("AC-4: Extracts carbohydrates from nutrition label", () => {
    const result = extractNutrition("Kohlenhydrate 55 g");
    assert.equal(result.carbohydrates, 55);
  });

  test("AC-5: Extracts sugars from nutrition label", () => {
    const result = extractNutrition("davon Zucker 45 g");
    assert.equal(result.sugars, 45);
  });

  test("AC-6: Extracts fiber from nutrition label", () => {
    const result = extractNutrition("Ballaststoffe 2,4 g");
    assert.equal(result.fiber, 2.4);
  });

  test("AC-7: Extracts protein from nutrition label", () => {
    const result = extractNutrition("Eiweiß 6,8 g");
    assert.equal(result.protein, 6.8);
  });

  test("AC-8: Extracts salt from nutrition label", () => {
    const result = extractNutrition("Salz 0,18 g");
    assert.equal(result.salt, 0.18);
  });
});