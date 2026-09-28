/**
 * Meal Planning Module
 * 
 * Calculates total nutritional values based on grams of each product.
 */

/**
 * Calculates the total nutritional values for a meal.
 * 
 * @param {Array} products - Array of product objects
 * @param {string} products[].name - Name of the product
 * @param {number} products[].grams - Grams of the product in the meal
 * @param {Object} products[].nutrition - Nutrition per 100g
 * @param {number} products[].nutrition.energy - Energy in kcal per 100g
 * @param {number} products[].nutrition.fats - Fats in g per 100g
 * @param {number} products[].nutrition.saturatedFats - Saturated fats in g per 100g
 * @param {number} products[].nutrition.carbs - Carbs in g per 100g
 * @param {number} products[].nutrition.sugars - Sugars in g per 100g
 * @param {number} products[].nutrition.fiber - Fiber in g per 100g
 * @param {number} products[].nutrition.protein - Protein in g per 100g
 * @param {number} products[].nutrition.salt - Salt in g per 100g
 * @returns {Object} Total nutritional values for the meal
 */
export function calculateMealTotal(products) {
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