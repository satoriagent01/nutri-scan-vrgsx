/**
 * Frontend application for NutriScan
 * Connects the UI to the backend modules
 */

import { extractNutrition } from '../src/ocr.js';
import { calculateMealTotal } from '../src/mealPlanner.js';
import { saveMealPlan, loadMealPlan } from '../src/storage.js';
import { NutrientTracker } from '../src/tracker.js';

// State
let currentScanResult = null;
let mealProducts = [];
let tracker = new NutrientTracker();

// DOM Elements
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const scanPreview = document.getElementById('scan-preview');
const previewImg = document.getElementById('preview-img');
const scanResults = document.getElementById('scan-results');
const nutritionGrid = document.getElementById('nutrition-grid');
const addMealBtn = document.getElementById('add-to-meal');
const aiConfig = document.getElementById('ai-config');
const aiUrlInput = document.getElementById('ai-url');
const aiKeyInput = document.getElementById('ai-key');
const saveAiConfigBtn = document.getElementById('save-ai-config');
const mealProductsDiv = document.getElementById('meal-products');
const addProductBtn = document.getElementById('add-product');
const mealTotalDiv = document.getElementById('meal-total');
const mealTotalGrid = document.getElementById('meal-total-grid');
const saveMealBtn = document.getElementById('save-meal');
const progressGrid = document.getElementById('progress-grid');
const goalInputsDiv = document.getElementById('goal-inputs');
const saveGoalsBtn = document.getElementById('save-goals');
const resetTrackerBtn = document.getElementById('reset-tracker');

// Load saved AI config
const savedUrl = localStorage.getItem('nutriscan_ai_url');
const savedKey = localStorage.getItem('nutriscan_ai_key');
if (savedUrl) aiUrlInput.value = savedUrl;
if (savedKey) aiKeyInput.value = savedKey;

// Load saved goals
const savedGoals = localStorage.getItem('nutriscan_goals');
if (savedGoals) {
  try {
    const goals = JSON.parse(savedGoals);
    tracker = new NutrientTracker(goals);
  } catch (e) {
    console.error('Failed to parse saved goals:', e);
  }
}

// Load saved meal plan
const savedMealPlan = loadMealPlan();
if (savedMealPlan) {
  // Restore meal plan state if needed
  console.log('Loaded saved meal plan:', savedMealPlan);
}

// File upload handling
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length > 0) {
    handleFile(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    scanPreview.classList.remove('hidden');
    scanResults.classList.add('hidden');
    
    // Simulate OCR processing
    simulateOcrScan(e.target.result);
  };
  reader.readAsDataURL(file);
}

async function simulateOcrScan(imageData) {
  const aiUrl = aiUrlInput.value;
  const aiKey = aiKeyInput.value;

  if (aiUrl && aiKey) {
    // Use real AI endpoint
    try {
      const response = await fetch(aiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract nutritional information from this product label. Return only a JSON object with keys: energy (kcal), fats (g), saturatedFats (g), carbs (g), sugars (g), fiber (g), protein (g), salt (g). All values per 100g.' },
                { type: 'image_url', image_url: { url: imageData } }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      // Parse JSON from response
      let parsed;
      try {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (e) {
        console.error('Failed to parse AI response:', e);
        alert('Failed to parse nutrition data. Please try again.');
        return;
      }

      currentScanResult = extractNutrition(parsed);
    } catch (error) {
      console.error('AI request failed:', error);
      alert('AI request failed. Using simulated data for demo.');
      currentScanResult = generateMockNutrition();
    }
  } else {
    // No AI config - use simulated data for demo
    currentScanResult = generateMockNutrition();
  }

  displayScanResults(currentScanResult);
}

function generateMockNutrition() {
  return {
    energy: Math.floor(Math.random() * 400) + 50,
    fats: Math.floor(Math.random() * 30) + 1,
    saturatedFats: Math.floor(Math.random() * 10) + 0.5,
    carbs: Math.floor(Math.random() * 60) + 5,
    sugars: Math.floor(Math.random() * 30) + 2,
    fiber: Math.floor(Math.random() * 15) + 1,
    protein: Math.floor(Math.random() * 25) + 2,
    salt: Math.floor(Math.random() * 2) + 0.1
  };
}

function displayScanResults(nutrition) {
  nutritionGrid.innerHTML = '';
  const labels = {
    energy: 'Energy (kcal)',
    fats: 'Fats (g)',
    saturatedFats: 'Saturated Fats (g)',
    carbs: 'Carbs (g)',
    sugars: 'Sugars (g)',
    fiber: 'Fiber (g)',
    protein: 'Protein (g)',
    salt: 'Salt (g)'
  };

  Object.entries(nutrition).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'nutrition-item';
    div.innerHTML = `<span class="label">${labels[key]}</span><span class="value">${value}</span>`;
    nutritionGrid.appendChild(div);
  });

  scanResults.classList.remove('hidden');
}

addMealBtn.addEventListener('click', () => {
  if (!currentScanResult) return;
  
  addProductToMeal(currentScanResult);
  scanResults.classList.add('hidden');
});

function addProductToMeal(nutrition) {
  const productName = prompt('Enter product name:', 'Scanned Product');
  if (!productName) return;

  const grams = parseFloat(prompt('Enter grams:', '100'));
  if (isNaN(grams) || grams <= 0) {
    alert('Invalid gram amount.');
    return;
  }

  mealProducts.push({
    name: productName,
    grams: grams,
    nutrition: nutrition
  });

  renderMealProducts();
  updateMealTotal();
}

function renderMealProducts() {
  mealProductsDiv.innerHTML = '';
  mealProducts.forEach((product, index) => {
    const div = document.createElement('div');
    div.className = 'meal-product';
    div.innerHTML = `
      <span>${product.name} (${product.grams}g)</span>
      <button class="btn btn-danger remove-product" data-index="${index}">Remove</button>
    `;
    mealProductsDiv.appendChild(div);
  });

  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-product').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      mealProducts.splice(index, 1);
      renderMealProducts();
      updateMealTotal();
    });
  });
}

function updateMealTotal() {
  if (mealProducts.length === 0) {
    mealTotalDiv.classList.add('hidden');
    return;
  }

  mealTotalDiv.classList.remove('hidden');
  const total = calculateMealTotal(mealProducts);
  
  mealTotalGrid.innerHTML = '';
  const labels = {
    energy: 'Energy (kcal)',
    fats: 'Fats (g)',
    saturatedFats: 'Saturated Fats (g)',
    carbs: 'Carbs (g)',
    sugars: 'Sugars (g)',
    fiber: 'Fiber (g)',
    protein: 'Protein (g)',
    salt: 'Salt (g)'
  };

  Object.entries(total).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'nutrition-item';
    div.innerHTML = `<span class="label">${labels[key]}</span><span class="value">${value}</span>`;
    mealTotalGrid.appendChild(div);
  });
}

addProductBtn.addEventListener('click', () => {
  const name = prompt('Product name:');
  if (!name) return;
  
  const grams = parseFloat(prompt('Grams:'));
  if (isNaN(grams) || grams <= 0) {
    alert('Invalid gram amount.');
    return;
  }

  const energy = parseFloat(prompt('Energy (kcal) per 100g:', '100')) || 0;
  const fats = parseFloat(prompt('Fats (g) per 100g:', '0')) || 0;
  const saturatedFats = parseFloat(prompt('Saturated Fats (g) per 100g:', '0')) || 0;
  const carbs = parseFloat(prompt('Carbs (g) per 100g:', '0')) || 0;
  const sugars = parseFloat(prompt('Sugars (g) per 100g:', '0')) || 0;
  const fiber = parseFloat(prompt('Fiber (g) per 100g:', '0')) || 0;
  const protein = parseFloat(prompt('Protein (g) per 100g:', '0')) || 0;
  const salt = parseFloat(prompt('Salt (g) per 100g:', '0')) || 0;

  mealProducts.push({
    name,
    grams,
    nutrition: { energy, fats, saturatedFats, carbs, sugars, fiber, protein, salt }
  });

  renderMealProducts();
  updateMealTotal();
});

saveMealBtn.addEventListener('click', () => {
  const mealPlan = {
    date: new Date().toISOString().split('T')[0],
    meals: [
      {
        name: 'Custom Meal',
        products: mealProducts
      }
    ]
  };

  saveMealPlan(mealPlan);
  alert('Meal plan saved!');
});

// Save AI config
saveAiConfigBtn.addEventListener('click', () => {
  localStorage.setItem('nutriscan_ai_url', aiUrlInput.value);
  localStorage.setItem('nutriscan_ai_key', aiKeyInput.value);
  alert('AI configuration saved!');
});

// Render progress
function renderProgress() {
  const progress = tracker.getProgress();
  progressGrid.innerHTML = '';
  
  const labels = {
    energy: 'Energy (kcal)',
    fats: 'Fats (g)',
    saturatedFats: 'Saturated Fats (g)',
    carbs: 'Carbs (g)',
    sugars: 'Sugars (g)',
    fiber: 'Fiber (g)',
    protein: 'Protein (g)',
    salt: 'Salt (g)'
  };

  Object.entries(progress).forEach(([key, data]) => {
    const div = document.createElement('div');
    div.className = 'nutrition-item';
    div.innerHTML = `
      <span class="label">${labels[key]}</span>
      <span class="value">${data.intake} / ${data.goal} (${data.percentage}%)</span>
    `;
    progressGrid.appendChild(div);
  });
}

// Add meal products to tracker
addMealBtn.addEventListener('click', () => {
  if (!currentScanResult) return;
  
  const productName = prompt('Enter product name:', 'Scanned Product');
  if (!productName) return;

  const grams = parseFloat(prompt('Enter grams:', '100'));
  if (isNaN(grams) || grams <= 0) {
    alert('Invalid gram amount.');
    return;
  }

  // Add to tracker
  const factor = grams / 100;
  Object.entries(currentScanResult).forEach(([key, value]) => {
    tracker.trackNutrient(key, value * factor);
  });

  // Add to meal
  mealProducts.push({
    name: productName,
    grams: grams,
    nutrition: currentScanResult
  });

  renderMealProducts();
  updateMealTotal();
  renderProgress();
  scanResults.classList.add('hidden');
});

// Save goals
saveGoalsBtn.addEventListener('click', () => {
  const newGoals = {};
  Object.keys(tracker.goals).forEach(key => {
    const input = document.getElementById(`goal-${key}`);
    if (input) {
      newGoals[key] = parseFloat(input.value) || 0;
    }
  });
  tracker = new NutrientTracker(newGoals);
  localStorage.setItem('nutriscan_goals', JSON.stringify(newGoals));
  renderProgress();
  renderGoalInputs();
  alert('Goals saved!');
});

// Reset tracker
resetTrackerBtn.addEventListener('click', () => {
  tracker.reset();
  renderProgress();
  alert('Daily tracker reset!');
});

// Render goal inputs
function renderGoalInputs() {
  goalInputsDiv.innerHTML = '';
  Object.entries(tracker.goals).forEach(([key, value]) => {
    const div = document.createElement('div');
    div.className = 'goal-input';
    div.innerHTML = `
      <label for="goal-${key}">${key}:</label>
      <input type="number" id="goal-${key}" value="${value}">
    `;
    goalInputsDiv.appendChild(div);
  });
}

// Initialize
renderGoalInputs();
renderProgress();