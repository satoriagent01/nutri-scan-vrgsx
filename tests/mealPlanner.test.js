import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Simulate the calculateMealTotal function behavior
function calculateMealTotal(products) {
  if (!products || !Array.isArray(products) || products.length === 0) {
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

  const totals = {
    energy: 0,
    fats: 0,
    saturatedFats: 0,
    carbs: 0,
    sugars: 0,
    fiber: 0,
    protein: 0,
    salt: 0
  };

  products.forEach(product => {
    const grams = product.grams || 0;
    const per100g = product.nutrition || {};
    
    // Calculate values based on grams (nutrition is per 100g)
    const factor = grams / 100;
    
    totals.energy += (per100g.energy || 0) * factor;
    totals.fats += (per100g.fats || 0) * factor;
    totals.saturatedFats += (per100g.saturatedFats || 0) * factor;
    totals.carbs += (per100g.carbs || 0) * factor;
    totals.sugars += (per100g.sugars || 0) * factor;
    totals.fiber += (per100g.fiber || 0) * factor;
    totals.protein += (per100g.protein || 0) * factor;
    totals.salt += (per100g.salt || 0) * factor;
  });

  // Round to reasonable precision
  Object.keys(totals).forEach(key => {
    totals[key] = Math.round(totals[key] * 100) / 100;
  });

  return totals;
}

describe("Meal Planning", () => {
  test("calculateMealTotal should sum nutritional values from multiple products", () => {
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
      },
      {
        name: "Rice",
        grams: 150,
        nutrition: {
          energy: 130,
          fats: 0.3,
          saturatedFats: 0.1,
          carbs: 28,
          sugars: 0.1,
          fiber: 0.4,
          protein: 2.7,
          salt: 0.01
        }
      }
    ];

    const result = calculateMealTotal(products);

    // Chicken 200g: energy 330, fats 7.2, sat 2, carbs 0, sugars 0, fiber 0, protein 62, salt 0.2
    // Rice 150g: energy 195, fats 0.45, sat 0.15, carbs 42, sugars 0.15, fiber 0.6, protein 4.05, salt 0.015
    // Total: energy 525, fats 7.65, sat 2.15, carbs 42, sugars 0.15, fiber 0.6, protein 66.05, salt 0.215
    assert.strictEqual(result.energy, 525);
    assert.strictEqual(result.fats, 7.65);
    assert.strictEqual(result.saturatedFats, 2.15);
    assert.strictEqual(result.carbs, 42);
    assert.strictEqual(result.sugars, 0.15);
    assert.strictEqual(result.fiber, 0.6);
    assert.strictEqual(result.protein, 66.05);
    assert.strictEqual(result.salt, 0.22);
  });

  test("calculateMealTotal should handle single product", () => {
    const products = [
      {
        name: "Apple",
        grams: 100,
        nutrition: {
          energy: 52,
          fats: 0.2,
          saturatedFats: 0,
          carbs: 14,
          sugars: 10,
          fiber: 2.4,
          protein: 0.3,
          salt: 0.01
        }
      }
    ];

    const result = calculateMealTotal(products);

    assert.strictEqual(result.energy, 52);
    assert.strictEqual(result.fats, 0.2);
    assert.strictEqual(result.saturatedFats, 0);
    assert.strictEqual(result.carbs, 14);
    assert.strictEqual(result.sugars, 10);
    assert.strictEqual(result.fiber, 2.4);
    assert.strictEqual(result.protein, 0.3);
    assert.strictEqual(result.salt, 0.01);
  });

  test("calculateMealTotal should handle empty products array", () => {
    const result = calculateMealTotal([]);

    assert.strictEqual(result.energy, 0);
    assert.strictEqual(result.fats, 0);
    assert.strictEqual(result.saturatedFats, 0);
    assert.strictEqual(result.carbs, 0);
    assert.strictEqual(result.sugars, 0);
    assert.strictEqual(result.fiber, 0);
    assert.strictEqual(result.protein, 0);
    assert.strictEqual(result.salt, 0);
  });

  test("calculateMealTotal should handle null/undefined input", () => {
    const result1 = calculateMealTotal(null);
    const result2 = calculateMealTotal(undefined);

    assert.strictEqual(result1.energy, 0);
    assert.strictEqual(result2.energy, 0);
  });

  test("calculateMealTotal should handle products with missing nutrition data", () => {
    const products = [
      {
        name: "Unknown Food",
        grams: 100,
        nutrition: {}
      }
    ];

    const result = calculateMealTotal(products);

    assert.strictEqual(result.energy, 0);
    assert.strictEqual(result.fats, 0);
    assert.strictEqual(result.saturatedFats, 0);
    assert.strictEqual(result.carbs, 0);
    assert.strictEqual(result.sugars, 0);
    assert.strictEqual(result.fiber, 0);
    assert.strictEqual(result.protein, 0);
    assert.strictEqual(result.salt, 0);
  });

  test("calculateMealTotal should handle products with missing grams", () => {
    const products = [
      {
        name: "Food",
        nutrition: {
          energy: 100,
          fats: 5,
          saturatedFats: 1,
          carbs: 20,
          sugars: 5,
          fiber: 2,
          protein: 10,
          salt: 0.3
        }
      }
    ];

    const result = calculateMealTotal(products);

    // grams defaults to 0, so all values should be 0
    assert.strictEqual(result.energy, 0);
    assert.strictEqual(result.fats, 0);
    assert.strictEqual(result.saturatedFats, 0);
    assert.strictEqual(result.carbs, 0);
    assert.strictEqual(result.sugars, 0);
    assert.strictEqual(result.fiber, 0);
    assert.strictEqual(result.protein, 0);
    assert.strictEqual(result.salt, 0);
  });
});