import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { calculateMealTotal } from "../src/mealPlanner.js";

describe("calculateMealTotal", () => {
  test("AC-8: sums nutrition values for a single product", () => {
    const products = [
      {
        name: "Chocolate Bar",
        grams: 30,
        nutrition: {
          energy: { kj: 688, kcal: 165 },
          fats: 10,
          saturatedFats: 3.9,
          carbohydrates: 16,
          sugars: 14,
          fiber: 0.7,
          protein: 2.0,
          salt: 0.05
        }
      }
    ];
    const total = calculateMealTotal(products);
    assert.deepStrictEqual(total, {
      energy: { kj: 688, kcal: 165 },
      fats: 10,
      saturatedFats: 3.9,
      carbohydrates: 16,
      sugars: 14,
      fiber: 0.7,
      protein: 2.0,
      salt: 0.05
    });
  });

  test("AC-9: sums nutrition values for multiple products", () => {
    const products = [
      {
        name: "Chocolate Bar",
        grams: 30,
        nutrition: {
          energy: { kj: 688, kcal: 165 },
          fats: 10,
          saturatedFats: 3.9,
          carbohydrates: 16,
          sugars: 14,
          fiber: 0.7,
          protein: 2.0,
          salt: 0.05
        }
      },
      {
        name: "Apple Juice",
        grams: 200,
        nutrition: {
          energy: { kj: 399, kcal: 94 },
          fats: 0,
          saturatedFats: 0,
          carbohydrates: 22,
          sugars: 20,
          fiber: 0,
          protein: 0.4,
          salt: 0
        }
      }
    ];
    const total = calculateMealTotal(products);
    assert.deepStrictEqual(total, {
      energy: { kj: 1087, kcal: 259 },
      fats: 10,
      saturatedFats: 3.9,
      carbohydrates: 38,
      sugars: 34,
      fiber: 0.7,
      protein: 2.4,
      salt: 0.05
    });
  });

  test("AC-10: handles empty product list", () => {
    const total = calculateMealTotal([]);
    assert.deepStrictEqual(total, {
      energy: { kj: 0, kcal: 0 },
      fats: 0,
      saturatedFats: 0,
      carbohydrates: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      salt: 0
    });
  });

  test("AC-11: scales nutrition values by grams", () => {
    const products = [
      {
        name: "Chocolate Bar",
        grams: 60,
        nutrition: {
          energy: { kj: 688, kcal: 165 },
          fats: 10,
          saturatedFats: 3.9,
          carbohydrates: 16,
          sugars: 14,
          fiber: 0.7,
          protein: 2.0,
          salt: 0.05
        }
      }
    ];
    const total = calculateMealTotal(products);
    assert.deepStrictEqual(total, {
      energy: { kj: 1376, kcal: 330 },
      fats: 20,
      saturatedFats: 7.8,
      carbohydrates: 32,
      sugars: 28,
      fiber: 1.4,
      protein: 4.0,
      salt: 0.1
    });
  });
});