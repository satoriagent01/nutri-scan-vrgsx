# NutriScan - Nutrition Label Scanner & Meal Planner

## Product Overview

NutriScan is a free, ad-free web application that allows users to photograph nutrition labels from food products, extract nutritional information using AI-powered OCR, and create custom meal plans by specifying the grams of each ingredient. The app supports multiple languages (German, French, Dutch, Italian, English, Spanish) and enables users to track any nutritional metric they care about - not just calories, but also sodium, saturated fats, fiber, and more.

## Features

### 1. Photo Capture & Upload
- Users can take photos of nutrition labels using their device camera or upload existing images
- Supports common image formats (JPEG, PNG, WebP)
- Image preprocessing for better OCR accuracy

### 2. AI-Powered OCR Extraction
- Uses OpenAI-compatible AI endpoint to extract nutritional information from photos
- Automatically detects and parses nutrition tables in multiple languages
- Extracts: energy (kJ/kcal), fats, saturated fats, carbohydrates, sugars, fiber, protein, sodium/salt, and other nutrients
- Returns structured data in a standardized format

### 3. Meal Planning
- Users can create custom meal plans by adding products/ingredients
- Specify the grams of each product in their plate
- Automatically calculates total nutritional values based on quantities
- Supports multiple meals per day

### 4. Custom Tracking
- Users can track any nutritional metric they want to monitor
- Set daily goals for specific nutrients
- View progress and summaries

### 5. Multi-Language Support
- Supports nutrition labels in German, French, Dutch, Italian, English, Spanish, and other languages
- UI available in multiple languages

## Technical Requirements

### Stack
- **Runtime**: Node.js 24 with ES modules
- **Testing**: Node's built-in test runner (`node --test`)
- **Build**: No build step required
- **UI**: Static web page served from `public/` directory
- **AI Integration**: OpenAI-compatible endpoint (user-configured URL and API key)

### OCR/AI Integration
- The AI endpoint is configured by the user (URL and API key)
- Tests never call the actual AI endpoint
- The OCR module is a pure function that can be tested independently

### Data Storage
- Local storage for user data (meal plans, tracked nutrients, goals)
- No server-side storage required

## Non-Functional Requirements

- **Free**: The application is completely free to use
- **No Ads**: No advertisements or sponsored content
- **Multi-Language**: Supports multiple languages for both UI and nutrition label parsing
- **Privacy**: User data stays on the device; no data sent to external servers except for AI OCR requests

## User Flows

### Flow 1: Scan a Nutrition Label
1. User opens the app
2. User takes a photo of a nutrition label or uploads an image
3. App sends the image to the AI endpoint for OCR processing
4. App displays the extracted nutritional information
5. User can save the product to their library or add it to a meal

### Flow 2: Create a Meal Plan
1. User navigates to the meal planner
2. User adds products/ingredients to their meal
3. For each product, user specifies the quantity in grams
4. App calculates and displays the total nutritional values
5. User can save the meal plan

### Flow 3: Track Nutrients
1. User sets daily goals for specific nutrients
2. User logs meals throughout the day
3. App tracks progress toward goals
4. User can view summaries and reports

## Acceptance Criteria

### AC-1: Photo Capture
- Users can take photos of nutrition labels using their device camera
- Users can upload existing images from their device
- Supported image formats: JPEG, PNG, WebP

### AC-2: OCR Extraction
- The app can extract nutritional information from photos of nutrition labels
- Extracted data includes: energy (kJ/kcal), fats, saturated fats, carbohydrates, sugars, fiber, protein, sodium/salt
- The OCR module is a pure function that takes an image and returns structured nutritional data
- The AI endpoint is configured by the user (URL and API key)

### AC-3: Multi-Language Support
- The app can parse nutrition labels in German, French, Dutch, Italian, English, and Spanish
- The UI supports multiple languages

### AC-4: Meal Planning
- Users can create custom meal plans by adding products/ingredients
- Users can specify the grams of each product in their plate
- The app automatically calculates total nutritional values based on quantities

### AC-5: Custom Tracking
- Users can track any nutritional metric they want to monitor
- Users can set daily goals for specific nutrients
- The app displays progress toward goals

### AC-6: Free and Ad-Free
- The application is completely free to use
- No advertisements or sponsored content

### AC-7: Privacy
- User data stays on the device (local storage)
- No data sent to external servers except for AI OCR requests

## Examples from Shared Images

### Example 1: Chocolate Bar (Image 1 - German/French/Italian)
- **Product**: Dr. Schär AG chocolate bar
- **Nutrition Table**:
  - Per 100g: Energy 2292 kJ / 549 kcal, Fats 33g, Saturated Fats 13g, Carbohydrates 55g, Sugars 45g, Fiber 2.4g, Protein 6.8g, Salt 0.18g
  - Per 30g (1 Melto): Energy 688 kJ / 165 kcal, Fats 10g, Saturated Fats 3.9g, Carbohydrates 16g, Sugars 14g, Fiber 0.7g, Protein 2.0g, Salt 0.05g
- **Ingredients**: Hazelnuts 20%, Lactose (milk), Milk powder, Sunflower lecithin, Vanilla flavor, Gluten-free waffle (rice flour, potato starch, milk white, corn starch, palm oil, emulsifier: sunflower lecithin), Dark chocolate 7.5% (cocoa mass*, cocoa butter*, sugar, emulsifier: soy lecithin, natural vanilla flavor), gluten-free waffle (rice flour, corn starch, sunflower oil, emulsifier: soy lecithin, salt, raising agent: sodium bicarbonate), hazelnuts 20% (sugar, cocoa butter*, whole milk powder, natural vanilla flavor), emulsifier: soy lecithin, natural vanilla flavor

### Example 2: Juice Bottle (Image 2 - Dutch)
- **Product**: Versgeperst appel-sinaasappel-en mangosap (Freshly squeezed apple-orange-mango juice)
- **Volume**: 1 L / 5 portions (200 ml)
- **Ingredients**: 45% apple, 35% orange, 20% mango, antioxidant (ascorbic acid [E300])
- **Nutrition Table**:
  - Per 100 ml: Energy 199 kJ / 47 kcal, Fats 0g, Saturated Fats 0g, Carbohydrates 11g, Sugars 10g, Fiber 0.7g, Protein 0.4g, Salt 0g
  - Per glass (200 ml): Energy 399 kJ / 94 kcal, Fats 0g, Saturated Fats 0g, Carbohydrates 22g, Sugars 20g, Fiber 1.4g, Protein 0.8g, Salt 0g
- **Vitamin C**: 26% / 21 mg per 100 ml, 52% / 42 mg per glass

### Example 3: Olive Oil Spray (Image 3 - Dutch)
- **Product**: Extra olijfolie van de eerste persing (Extra virgin olive oil spray)
- **Volume**: 200 ml e / 335 g
- **Ingredients**: Extra virgin olive oil
- **Nutrition Table**:
  - Per 100 ml: Energy 3404 kJ / 828 kcal, Fats 92g, Saturated Fats 14g, Carbohydrates 0g, Sugars 0g, Fiber 0g, Protein 0g, Salt 0g
- **Vitamin E**: 150% of daily reference intake per 100 ml
- **Reference Intake**: 8400 kJ / 2000 kcal per day for an average adult

## Modules

### `src/ocr.js`
- **Function**: `extractNutrition(imageData)`
  - **Parameters**: `imageData` (string - base64 encoded image or URL)
  - **Returns**: Object with nutritional information
  - **Example**:
    ```javascript
    {
      energy: { kJ: 2292, kcal: 549 },
      fats: 33,
      saturatedFats: 13,
      carbohydrates: 55,
      sugars: 45,
      fiber: 2.4,
      protein: 6.8,
      salt: 0.18
    }
    ```

### `src/mealPlanner.js`
- **Function**: `calculateMealTotal(products)`
  - **Parameters**: `products` (array of objects with `name`, `grams`, and `nutrition` fields)
  - **Returns**: Object with total nutritional values for the meal
  - **Example**:
    ```javascript
    // Input: [{ name: "Chocolate Bar", grams: 30, nutrition: { energy: { kJ: 2292, kcal: 549 }, fats: 33, ... } }]
    // Output: { energy: { kJ: 687.6, kcal: 164.7 }, fats: 9.9, ... }
    ```

### `src/storage.js`
- **Function**: `saveMealPlan(mealPlan)`
  - **Parameters**: `mealPlan` (object - the meal plan to save)
  - **Returns**: Promise resolving to boolean (success/failure)
- **Function**: `loadMealPlan(mealPlanId)`
  - **Parameters**: `mealPlanId` (string - the ID of the meal plan to load)
  - **Returns**: Promise resolving to the meal plan object or null

### `src/tracker.js`
- **Function**: `trackNutrient(nutrient, value)`
  - **Parameters**: `nutrient` (string - the nutrient name), `value` (number - the value to track)
  - **Returns**: Promise resolving to the updated tracking data
- **Function**: `getProgress(nutrient)`
  - **Parameters**: `nutrient` (string - the nutrient name)
  - **Returns**: Object with current value, goal, and percentage