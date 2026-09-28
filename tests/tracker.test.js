import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { trackNutrient, getProgress } from "../src/tracker.js";

describe("tracker", () => {
  test("AC-16: trackNutrient records a nutrient value", () => {
    trackNutrient("energy", 500);
    const progress = getProgress("energy");
    assert.strictEqual(progress.total, 500);
  });

  test("AC-17: trackNutrient accumulates values", () => {
    trackNutrient("protein", 10);
    trackNutrient("protein", 20);
    const progress = getProgress("protein");
    assert.strictEqual(progress.total, 30);
  });

  test("AC-18: getProgress returns zero for untracked nutrients", () => {
    const progress = getProgress("sodium");
    assert.strictEqual(progress.total, 0);
  });

  test("AC-19: getProgress includes goal comparison", () => {
    trackNutrient("sodium", 1500);
    const progress = getProgress("sodium");
    assert.strictEqual(progress.total, 1500);
    assert.strictEqual(progress.goal, 2300);
    assert.strictEqual(progress.remaining, 800);
    assert.strictEqual(progress.percentage, Math.round((1500 / 2300) * 100));
  });

  test("AC-20: getProgress handles exceeding goal", () => {
    trackNutrient("saturatedFats", 30);
    const progress = getProgress("saturatedFats");
    assert.strictEqual(progress.total, 30);
    assert.strictEqual(progress.goal, 20);
    assert.strictEqual(progress.remaining, -10);
    assert.ok(progress.percentage > 100);
  });
});