import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { saveMealPlan, loadMealPlan } from "../src/storage.js";

describe("storage", () => {
  test("AC-12: saveMealPlan persists a meal plan to localStorage", () => {
    const mealPlan = {
      id: "plan-1",
      name: "Breakfast",
      products: [
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
      ]
    };
    saveMealPlan(mealPlan);
    const saved = localStorage.getItem("nutri-scan:mealPlan:plan-1");
    assert.ok(saved);
    assert.strictEqual(saved, JSON.stringify(mealPlan));
  });

  test("AC-13: loadMealPlan retrieves a saved meal plan", () => {
    const mealPlan = {
      id: "plan-2",
      name: "Lunch",
      products: [
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
      ]
    };
    saveMealPlan(mealPlan);
    const loaded = loadMealPlan("plan-2");
    assert.deepStrictEqual(loaded, mealPlan);
  });

  test("AC-14: loadMealPlan returns null for non-existent plan", () => {
    const loaded = loadMealPlan("non-existent");
    assert.strictEqual(loaded, null);
  });

  test("AC-15: saveMealPlan overwrites existing plan", () => {
    const mealPlan1 = {
      id: "plan-3",
      name: "Dinner",
      products: []
    };
    const mealPlan2 = {
      id: "plan-3",
      name: "Dinner Updated",
      products: [
        {
          name: "Olive Oil",
          grams: 10,
          nutrition: {
            energy: { kj: 3404, kcal: 828 },
            fats: 92,
            saturatedFats: 14,
            carbohydrates: 0,
            sugars: 0,
            fiber: 0,
            protein: 0,
            salt: 0
          }
        }
      ]
    };
    saveMealPlan(mealPlan1);
    saveMealPlan(mealPlan2);
    const loaded = loadMealPlan("plan-3");
    assert.deepStrictEqual(loaded, mealPlan2);
  });
});