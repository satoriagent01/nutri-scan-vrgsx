import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { saveMealPlan, loadMealPlan } from "../src/storage.js";

// Mock localStorage
const mockStorage = {};
global.localStorage = {
  getItem(key) {
    return mockStorage[key] || null;
  },
  setItem(key, value) {
    mockStorage[key] = value;
  },
  removeItem(key) {
    delete mockStorage[key];
  },
  clear() {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  }
};

describe("saveMealPlan and loadMealPlan", () => {
  test("AC1: saves and loads a simple meal plan", () => {
    const mealPlan = {
      date: "2024-01-15",
      meals: [
        {
          name: "Breakfast",
          products: [
            { name: "Oatmeal", grams: 50, nutrition: { energy: 389, fats: 6.9, saturatedFats: 1.2, carbs: 66, sugars: 1.2, fiber: 10.6, protein: 16.9, salt: 0.03 } }
          ]
        }
      ]
    };

    saveMealPlan(mealPlan);
    const loaded = loadMealPlan();

    assert.deepStrictEqual(loaded, mealPlan);
  });

  test("AC2: saves and loads a complex meal plan with multiple meals", () => {
    const mealPlan = {
      date: "2024-01-15",
      meals: [
        {
          name: "Breakfast",
          products: [
            { name: "Oatmeal", grams: 50, nutrition: { energy: 389, fats: 6.9, saturatedFats: 1.2, carbs: 66, sugars: 1.2, fiber: 10.6, protein: 16.9, salt: 0.03 } }
          ]
        },
        {
          name: "Lunch",
          products: [
            { name: "Chicken", grams: 200, nutrition: { energy: 165, fats: 3.6, saturatedFats: 1, carbs: 0, sugars: 0, fiber: 0, protein: 31, salt: 0.1 } }
          ]
        },
        {
          name: "Dinner",
          products: [
            { name: "Salad", grams: 150, nutrition: { energy: 20, fats: 0.3, saturatedFats: 0, carbs: 3, sugars: 2, fiber: 1.5, protein: 1.5, salt: 0.02 } }
          ]
        }
      ]
    };

    saveMealPlan(mealPlan);
    const loaded = loadMealPlan();

    assert.deepStrictEqual(loaded, mealPlan);
  });

  test("AC3: returns null when no meal plan is saved", () => {
    // Clear storage first
    localStorage.clear();

    const result = loadMealPlan();

    assert.strictEqual(result, null);
  });

  test("AC4: overwrites existing meal plan", () => {
    const mealPlan1 = {
      date: "2024-01-15",
      meals: [{ name: "Breakfast", products: [] }]
    };

    const mealPlan2 = {
      date: "2024-01-16",
      meals: [{ name: "Lunch", products: [] }]
    };

    saveMealPlan(mealPlan1);
    saveMealPlan(mealPlan2);
    const loaded = loadMealPlan();

    assert.deepStrictEqual(loaded, mealPlan2);
  });

  test("AC5: returns null for malformed JSON", () => {
    localStorage.setItem("mealPlan", "{ invalid json }");

    const result = loadMealPlan();

    assert.strictEqual(result, null);
  });

  test("AC6: handles empty meal plan object", () => {
    const mealPlan = {
      date: "2024-01-15",
      meals: []
    };

    saveMealPlan(mealPlan);
    const loaded = loadMealPlan();

    assert.deepStrictEqual(loaded, mealPlan);
  });
});