/**
 * Nutrient Tracking Module
 * 
 * Tracks daily nutrient intake and compares against user-set goals.
 */

/**
 * NutrientTracker class for tracking daily nutrient intake.
 */
export class NutrientTracker {
  /**
   * Creates a new NutrientTracker.
   * 
   * @param {Object} [goals] - Custom goals for each nutrient. Defaults to standard daily values.
   */
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

  /**
   * Tracks a nutrient intake.
   * 
   * @param {string} nutrient - The nutrient name
   * @param {number} amount - The amount consumed
   */
  trackNutrient(nutrient, amount) {
    if (this.dailyIntake.hasOwnProperty(nutrient)) {
      this.dailyIntake[nutrient] += amount;
      // Round to 2 decimal places
      this.dailyIntake[nutrient] = Math.round(this.dailyIntake[nutrient] * 100) / 100;
    }
  }

  /**
   * Gets the current progress for all tracked nutrients.
   * 
   * @returns {Object} Progress object with intake, goal, percentage, and remaining for each nutrient
   */
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

  /**
   * Resets all daily intake to zero.
   */
  reset() {
    Object.keys(this.dailyIntake).forEach(key => {
      this.dailyIntake[key] = 0;
    });
  }
}