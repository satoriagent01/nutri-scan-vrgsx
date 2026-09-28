import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateMealTotal } from "../src/mealPlanner.js";

describe("calculateMealTotal", () => {
  test("AC1: calculates totals for a single product", () => {
    const products = [
      {
        name: "Chicken Breast",
        grams: 200,
        nutrition: {
          energy: 165,
          fats: 3.6,
          saturatedFats: 1,
          carbs: 0,
          sugars: 0,
          fiber: 0,
          protein: 31,
          salt: 0.1
        }
      }
    ];

    const result = calculateMealTotal(products);

    // 200g = 2 * 100g, so multiply per-100g values by 2
    assert.strictEqual(result.energy, 330);
    assert.strictEqual(result.fats, 7.2);
    assert.strictEqual(result.saturatedFats, 2);
    assert.strictEqual(result.carbs, 0);
    assert.strictEqual(result.sugars, 0);
    assert.strictEqual(result.fiber, 0);
    assert.strictEqual(result.protein, 62);
    assert.strictEqual(result.salt, 0.2);
  });

  test("AC2: sums nutritional values from multiple products", () => {
    const products = [
      {
        name: "Rice",
        grams: 150,
        nutrition: {
          energy: 130,
          fats: 0.3,
          saturatedFats: 0.1,
          carbs: 28,
          sugars: 0,
          fiber: 0.4,
          protein: 2.7,
          salt: 0
        }
      },
      {
        name: "Broccoli",
        grams: 100,
        nutrition: {
          energy: 34,
          fats: 0.4,
          saturatedFats: 0,
          carbs: 7,
          sugars: 1.7,
          fiber: 2.6,
          protein: 2.8,
          salt: 0.03
        }
      }
    ];

    const result = calculateMealTotal(products);

    // Rice 150g: factor 1.5
    // Rice: energy=195, fats=0.45, saturatedFats=0.15, carbs=42, sugars=0, fiber=0.6, protein=4.05, salt=0
    // Broccoli 100g: factor 1.0
    // Broccoli: energy=34, fats=0.4, saturatedFats=0, carbs=7, sugars=1.7, fiber=2.6, protein=2.8, salt=0.03
    // Total: energy=229, fats=0.85, saturatedFats=0.15, carbs=49, sugars=1.7, fiber=3.2, protein=6.85, salt=0.03
    assert.strictEqual(result.energy, 229);
    assert.strictEqual(result.fats, 0.85);
    assert.strictEqual(result.saturatedFats, 0.15);
    assert.strictEqual(result.carbs, 49);
    assert.strictEqual(result.sugars, 1.7);
    assert.strictEqual(result.fiber, 3.2);
    assert.strictEqual(result.protein, 6.85);
    assert.strictEqual(result.salt, 0.03);
  });

  test("AC3: returns zeros for empty array", () => {
    const result = calculateMealTotal([]);

    assert.deepStrictEqual(result, {
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

  test("AC4: returns zeros for null input", () => {
    const result = calculateMealTotal(null);

    assert.deepStrictEqual(result, {
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

  test("AC5: handles products with missing grams (defaults to 0)", () => {
    const products = [
      {
        name: "Unknown",
        nutrition: {
          energy: 100,
          fats: 5,
          saturatedFats: 1,
          carbs: 10,
          sugars: 2,
          fiber: 0.5,
          protein: 3,
          salt: 0.1
        }
      }
    ];

    const result = calculateMealTotal(products);

    // No grams means 0, so all values should be 0
    assert.deepStrictEqual(result, {
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

  test("AC6: handles products with missing nutrition data", () => {
    const products = [
      {
        name: "Unknown",
        grams: 100,
        nutrition: {}
      }
    ];

    const result = calculateMealTotal(products);

    // No nutrition data means all values should be 0
    assert.deepStrictEqual(result, {
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

  test("AC7: rounds values to 2 decimal places", () => {
    const products = [
      {
        name: "Test",
        grams: 33,
        nutrition: {
          energy: 100,
          fats: 5,
          saturatedFats: 1,
          carbs: 10,
          sugars: 2,
          fiber: 0.5,
          protein: 3,
          salt: 0.1
        }
      }
    ];

    const result = calculateMealTotal(products);

    // 33g = 0.33 * 100g
    // energy: 100 * 0.33 = 33
    // fats: 5 * 0.33 = 1.65
    // saturatedFats: 1 * 0.33 = 0.33
    // carbs: 10 * 0.33 = 3.3
    // sugars: 2 * 0.33 = 0.66
    // fiber: 0.5 * 0.33 = 0.165 -> rounded to 0.17
    // protein: 3 * 0.33 = 0.99
    // salt: 0.1 * 0.33 = 0.033 -> rounded to 0.03
    assert.strictEqual(result.energy, 33);
    assert.strictEqual(result.fats, 1.65);
    assert.strictEqual(result.saturatedFats, 0.33);
    assert.strictEqual(result.carbs, 3.3);
    assert.strictEqual(result.sugars, 0.66);
    assert.strictEqual(result.fiber, 0.17);
    assert.strictEqual(result.protein, 0.99);
    assert.strictEqual(result.salt, 0.03);
  });
});