import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Simulate the trackNutrient and getProgress function behaviors
class NutrientTracker {
  constructor(goals) {
    this.goals = goals || {
      energy: 2000,
      fats: 65,
      saturatedFats: 20,
      carbs: 275,
      sugars: 50,
      fiber: 25,
      protein: 50,
      salt: 6
    };
    this.dailyIntake = {
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

  trackNutrient(nutrient, amount) {
    if (this.dailyIntake.hasOwnProperty(nutrient)) {
      this.dailyIntake[nutrient] += amount;
      // Round to 2 decimal places
      this.dailyIntake[nutrient] = Math.round(this.dailyIntake[nutrient] * 100) / 100;
    }
  }

  getProgress() {
    const progress = {};
    Object.keys(this.goals).forEach(nutrient => {
      const intake = this.dailyIntake[nutrient] || 0;
      const goal = this.goals[nutrient];
      progress[nutrient] = {
        intake: intake,
        goal: goal,
        percentage: goal > 0 ? Math.round((intake / goal) * 10000) / 100 : 0,
        remaining: goal - intake
      };
    });
    return progress;
  }

  reset() {
    Object.keys(this.dailyIntake).forEach(key => {
      this.dailyIntake[key] = 0;
    });
  }
}

describe("Nutrient Tracking", () => {
  test("trackNutrient should add to daily intake", () => {
    const tracker = new NutrientTracker();
    
    tracker.trackNutrient('energy', 500);
    tracker.trackNutrient('protein', 20);
    
    const progress = tracker.getProgress();
    
    assert.strictEqual(progress.energy.intake, 500);
    assert.strictEqual(progress.protein.intake, 20);
  });

  test("getProgress should return correct percentages", () => {
    const tracker = new NutrientTracker({
      energy: 2000,
      protein: 100
    });
    
    tracker.trackNutrient('energy', 1000);
    tracker.trackNutrient('protein', 50);
    
    const progress = tracker.getProgress();
    
    assert.strictEqual(progress.energy.percentage, 50);
    assert.strictEqual(progress.protein.percentage, 50);
    assert.strictEqual(progress.energy.remaining, 1000);
    assert.strictEqual(progress.protein.remaining, 50);
  });

  test("trackNutrient should handle multiple additions", () => {
    const tracker = new NutrientTracker();
    
    tracker.trackNutrient('energy', 300);
    tracker.trackNutrient('energy', 200);
    tracker.trackNutrient('energy', 150);
    
    const progress = tracker.getProgress();
    
    assert.strictEqual(progress.energy.intake, 650);
    assert.strictEqual(progress.energy.percentage, 32.5);
  });

  test("getProgress should handle zero goals gracefully", () => {
    const tracker = new NutrientTracker({
      energy: 0,
      protein: 50
    });
    
    tracker.trackNutrient('energy', 100);
    tracker.trackNutrient('protein', 25);
    
    const progress = tracker.getProgress();
    
    assert.strictEqual(progress.energy.percentage, 0);
    assert.strictEqual(progress.protein.percentage, 50);
  });

  test("trackNutrient should handle negative values", () => {
    const tracker = new NutrientTracker();
    
    tracker.trackNutrient('energy', 500);
    tracker.trackNutrient('energy', -100);
    
    const progress = tracker.getProgress();
    
    assert.strictEqual(progress.energy.intake, 400);
  });

  test("trackNutrient should handle unknown nutrients", () => {
    const tracker = new NutrientTracker();
    
    // Should not throw, just ignore unknown nutrients
    tracker.trackNutrient('unknownNutrient', 100);
    
    const progress = tracker.getProgress();
    
    // energy should still be 0
    assert.strictEqual(progress.energy.intake, 0);
  });

  test("reset should clear all daily intake", () => {
    const tracker = new NutrientTracker();
    
    tracker.trackNutrient('energy', 500);
    tracker.trackNutrient('protein', 30);
    
    tracker.reset();
    
    const progress = tracker.getProgress();
    
    assert.strictEqual(progress.energy.intake, 0);
    assert.strictEqual(progress.protein.intake, 0);
    assert.strictEqual(progress.energy.percentage, 0);
    assert.strictEqual(progress.protein.percentage, 0);
  });

  test("getProgress should return all nutrients from goals", () => {
    const tracker = new NutrientTracker();
    
    const progress = tracker.getProgress();
    
    assert.ok(progress.energy);
    assert.ok(progress.fats);
    assert.ok(progress.saturatedFats);
    assert.ok(progress.carbs);
    assert.ok(progress.sugars);
    assert.ok(progress.fiber);
    assert.ok(progress.protein);
    assert.ok(progress.salt);
    
    // All should be 0 initially
    assert.strictEqual(progress.energy.intake, 0);
    assert.strictEqual(progress.fats.intake, 0);
    assert.strictEqual(progress.saturatedFats.intake, 0);
    assert.strictEqual(progress.carbs.intake, 0);
    assert.strictEqual(progress.sugars.intake, 0);
    assert.strictEqual(progress.fiber.intake, 0);
    assert.strictEqual(progress.protein.intake, 0);
    assert.strictEqual(progress.salt.intake, 0);
  });

  test("trackNutrient should handle floating point precision", () => {
    const tracker = new NutrientTracker();
    
    tracker.trackNutrient('energy', 0.1);
    tracker.trackNutrient('energy', 0.2);
    
    const progress = tracker.getProgress();
    
    // Should be 0.3, not 0.30000000000000004
    assert.strictEqual(progress.energy.intake, 0.3);
  });

  test("getProgress should handle large values", () => {
    const tracker = new NutrientTracker({
      energy: 2000
    });
    
    tracker.trackNutrient('energy', 3000);
    
    const progress = tracker.getProgress();
    
    assert.strictEqual(progress.energy.intake, 3000);
    assert.strictEqual(progress.energy.percentage, 150);
    assert.strictEqual(progress.energy.remaining, -1000);
  });
});