import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { NutrientTracker } from "../src/tracker.js";

describe("NutrientTracker", () => {
  test("AC1: tracks a nutrient and calculates correct percentage", () => {
    const tracker = new NutrientTracker();

    tracker.trackNutrient("energy", 500);

    const progress = tracker.getProgress();

    assert.strictEqual(progress.energy.intake, 500);
    assert.strictEqual(progress.energy.goal, 2000);
    assert.strictEqual(progress.energy.percentage, 25);
    assert.strictEqual(progress.energy.remaining, 1500);
  });

  test("AC2: tracks multiple nutrients", () => {
    const tracker = new NutrientTracker();

    tracker.trackNutrient("energy", 500);
    tracker.trackNutrient("protein", 25);
    tracker.trackNutrient("fats", 30);

    const progress = tracker.getProgress();

    assert.strictEqual(progress.energy.intake, 500);
    assert.strictEqual(progress.energy.percentage, 25);
    assert.strictEqual(progress.protein.intake, 25);
    assert.strictEqual(progress.protein.goal, 50);
    assert.strictEqual(progress.protein.percentage, 50);
    assert.strictEqual(progress.fats.intake, 30);
    assert.strictEqual(progress.fats.goal, 65);
    assert.strictEqual(progress.fats.percentage, Math.round((30 / 65) * 10000) / 100);
  });

  test("AC3: adds to existing intake", () => {
    const tracker = new NutrientTracker();

    tracker.trackNutrient("energy", 300);
    tracker.trackNutrient("energy", 200);

    const progress = tracker.getProgress();

    assert.strictEqual(progress.energy.intake, 500);
    assert.strictEqual(progress.energy.percentage, 25);
  });

  test("AC4: handles zero goals", () => {
    const tracker = new NutrientTracker({
      energy: 2000,
      fiber: 0  // Zero goal
    });

    tracker.trackNutrient("fiber", 10);

    const progress = tracker.getProgress();

    assert.strictEqual(progress.fiber.intake, 10);
    assert.strictEqual(progress.fiber.goal, 0);
    assert.strictEqual(progress.fiber.percentage, 0);
  });

  test("AC5: handles unknown nutrients (does not throw)", () => {
    const tracker = new NutrientTracker();

    // Should not throw, but also should not track
    tracker.trackNutrient("unknownNutrient", 100);

    const progress = tracker.getProgress();

    // Unknown nutrient should not be in progress
    assert.strictEqual(progress.unknownNutrient, undefined);
  });

  test("AC6: reset clears all intake", () => {
    const tracker = new NutrientTracker();

    tracker.trackNutrient("energy", 500);
    tracker.trackNutrient("protein", 25);

    tracker.reset();

    const progress = tracker.getProgress();

    assert.strictEqual(progress.energy.intake, 0);
    assert.strictEqual(progress.energy.percentage, 0);
    assert.strictEqual(progress.protein.intake, 0);
    assert.strictEqual(progress.protein.percentage, 0);
  });

  test("AC7: handles floating point precision", () => {
    const tracker = new NutrientTracker();

    tracker.trackNutrient("energy", 0.1);
    tracker.trackNutrient("energy", 0.2);

    const progress = tracker.getProgress();

    // 0.1 + 0.2 should be rounded to 0.3
    assert.strictEqual(progress.energy.intake, 0.3);
  });

  test("AC8: custom goals are respected", () => {
    const customGoals = {
      energy: 2500,
      protein: 100
    };

    const tracker = new NutrientTracker(customGoals);

    tracker.trackNutrient("energy", 1000);
    tracker.trackNutrient("protein", 50);

    const progress = tracker.getProgress();

    assert.strictEqual(progress.energy.goal, 2500);
    assert.strictEqual(progress.energy.percentage, 40);
    assert.strictEqual(progress.protein.goal, 100);
    assert.strictEqual(progress.protein.percentage, 50);
  });

  test("AC9: handles negative values (does not throw)", () => {
    const tracker = new NutrientTracker();

    tracker.trackNutrient("energy", -100);

    const progress = tracker.getProgress();

    assert.strictEqual(progress.energy.intake, -100);
    assert.strictEqual(progress.energy.remaining, 2100);
  });

  test("AC10: handles large values", () => {
    const tracker = new NutrientTracker();

    tracker.trackNutrient("energy", 5000);

    const progress = tracker.getProgress();

    assert.strictEqual(progress.energy.intake, 5000);
    assert.strictEqual(progress.energy.percentage, 250);
    assert.strictEqual(progress.energy.remaining, -3000);
  });
});