/**
 * Storage Module
 * 
 * Persists and retrieves meal plans from localStorage.
 */

/**
 * Saves a meal plan to localStorage.
 * 
 * @param {Object} mealPlan - The meal plan object to save
 * @param {string} mealPlan.date - The date of the meal plan
 * @param {Array} mealPlan.meals - Array of meals
 */
export function saveMealPlan(mealPlan) {
  localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
}

/**
 * Loads a meal plan from localStorage.
 * 
 * @returns {Object|null} The meal plan object, or null if not found or invalid
 */
export function loadMealPlan() {
  const stored = localStorage.getItem('mealPlan');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}