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

// Simulate the saveMealPlan and loadMealPlan function behaviors
function saveMealPlan(mealPlan) {
  localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
}

function loadMealPlan() {
  const stored = localStorage.getItem('mealPlan');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

describe("Storage", () => {
  test("saveMealPlan should store meal plan in localStorage", () => {
    const mealPlan = {
      date: "2024-01-15",
      meals: [
        {
          name: "Breakfast",
          products: [
            { name: "Oatmeal", grams: 50, nutrition: { energy: 389, fats: 6.9, saturatedFats: 1.2, carbs: 66, sugars: 1.2, fiber: 10.6, protein: 16.9, salt: 0.01 } }
          ]
        }
      ]
    };

    saveMealPlan(mealPlan);

    const stored = localStorage.getItem('mealPlan');
    assert.ok(stored);
    assert.strictEqual(stored, JSON.stringify(mealPlan));
  });

  test("loadMealPlan should retrieve meal plan from localStorage", () => {
    const mealPlan = {
      date: "2024-01-15",
      meals: [
        {
          name: "Lunch",
          products: [
            { name: "Salad", grams: 200, nutrition: { energy: 25, fats: 2, saturatedFats: 0.3, carbs: 3, sugars: 2, fiber: 2, protein: 2, salt: 0.05 } }
          ]
        }
      ]
    };

    saveMealPlan(mealPlan);
    const loaded = loadMealPlan();

    assert.ok(loaded);
    assert.strictEqual(loaded.date, "2024-01-15");
    assert.strictEqual(loaded.meals.length, 1);
    assert.strictEqual(loaded.meals[0].name, "Lunch");
  });

  test("loadMealPlan should return null when no meal plan is stored", () => {
    localStorage.clear();
    const loaded = loadMealPlan();
    assert.strictEqual(loaded, null);
  });

  test("saveMealPlan and loadMealPlan should handle complex meal plans", () => {
    const complexMealPlan = {
      date: "2024-01-15",
      meals: [
        {
          name: "Breakfast",
          products: [
            { name: "Oatmeal", grams: 50, nutrition: { energy: 389, fats: 6.9, saturatedFats: 1.2, carbs: 66, sugars: 1.2, fiber: 10.6, protein: 16.9, salt: 0.01 } },
            { name: "Banana", grams: 120, nutrition: { energy: 89, fats: 0.3, saturatedFats: 0, carbs: 23, sugars: 12, fiber: 2.6, protein: 1.1, salt: 0.01 } }
          ]
        },
        {
          name: "Lunch",
          products: [
            { name: "Chicken Breast", grams: 200, nutrition: { energy: 165, fats: 3.6, saturatedFats: 1, carbs: 0, sugars: 0, fiber: 0, protein: 31, salt: 0.1 } },
            { name: "Rice", grams: 150, nutrition: { energy: 130, fats: 0.3, saturatedFats: 0.1, carbs: 28, sugars: 0.1, fiber: 0.4, protein: 2.7, salt: 0.01 } }
          ]
        },
        {
          name: "Dinner",
          products: [
            { name: "Salmon", grams: 150, nutrition: { energy: 208, fats: 13, saturatedFats: 3, carbs: 0, sugars: 0, fiber: 0, protein: 20, salt: 0.2 } }
          ]
        }
      ]
    };

    saveMealPlan(complexMealPlan);
    const loaded = loadMealPlan();

    assert.ok(loaded);
    assert.strictEqual(loaded.date, "2024-01-15");
    assert.strictEqual(loaded.meals.length, 3);
    assert.strictEqual(loaded.meals[0].name, "Breakfast");
    assert.strictEqual(loaded.meals[0].products.length, 2);
    assert.strictEqual(loaded.meals[1].name, "Lunch");
    assert.strictEqual(loaded.meals[1].products.length, 2);
    assert.strictEqual(loaded.meals[2].name, "Dinner");
    assert.strictEqual(loaded.meals[2].products.length, 1);
  });

  test("saveMealPlan should overwrite existing meal plan", () => {
    const mealPlan1 = {
      date: "2024-01-15",
      meals: [{ name: "Old Meal", products: [] }]
    };

    const mealPlan2 = {
      date: "2024-01-16",
      meals: [{ name: "New Meal", products: [] }]
    };

    saveMealPlan(mealPlan1);
    saveMealPlan(mealPlan2);

    const loaded = loadMealPlan();
    assert.strictEqual(loaded.date, "2024-01-16");
    assert.strictEqual(loaded.meals[0].name, "New Meal");
  });

  test("loadMealPlan should handle malformed JSON gracefully", () => {
    localStorage.setItem('mealPlan', 'invalid json');
    const loaded = loadMealPlan();
    assert.strictEqual(loaded, null);
  });

  test("saveMealPlan should handle empty meal plan", () => {
    const emptyMealPlan = {
      date: "2024-01-15",
      meals: []
    };

    saveMealPlan(emptyMealPlan);
    const loaded = loadMealPlan();

    assert.ok(loaded);
    assert.strictEqual(loaded.date, "2024-01-15");
    assert.strictEqual(loaded.meals.length, 0);
  });
});