# NutriScan

A free, ad-free nutrition tracking app that lets you scan product nutrition labels with your camera and track your daily intake.

## Features

- **Photo Scan**: Take or upload photos of nutrition labels from products
- **AI-Powered OCR**: Extracts nutritional data (energy, fats, saturated fats, carbs, sugars, fiber, protein, salt) from label images using an OpenAI-compatible AI endpoint
- **Meal Planning**: Create custom meals by specifying grams of each product
- **Nutrient Tracking**: Track daily intake against custom goals for any nutrient
- **Multi-language Support**: Works with nutrition labels in any language (German, French, Dutch, Italian, etc.)
- **Completely Free & Ad-Free**: No subscriptions, no ads, no tracking

## How to Run

### Using a local server

```bash
npx serve public
```

Or any static file server:

```bash
python3 -m http.server 8000 --directory public
```

Then open `http://localhost:8000` in your browser.

### Running tests

```bash
node --test tests/*.test.js
```

## Configure the AI Endpoint

NutriScan uses an OpenAI-compatible API for OCR extraction. To configure:

1. Open the app in your browser
2. Scroll to the "AI Configuration" section
3. Enter your API endpoint URL (e.g., `https://api.openai.com/v1/chat/completions`)
4. Enter your API key
5. Click "Save AI Configuration"

The app will send the photo to your configured endpoint with a prompt asking for nutritional data extraction.

### Supported Endpoints

- OpenAI (`https://api.openai.com/v1/chat/completions`)
- Any OpenAI-compatible API (Ollama, LM Studio, etc.)

## How to Use

1. **Scan a Product**: Click or drag-and-drop a photo of a nutrition label
2. **View Results**: The app extracts nutritional data per 100g
3. **Add to Meal**: Enter the product name and grams consumed
4. **Track Intake**: Nutrients are automatically added to your daily tracker
5. **Set Goals**: Customize daily goals for each nutrient
6. **Save Meal Plans**: Save your meal plans to localStorage

## What's Not Done Yet

- [ ] Real-time camera capture (uses file upload instead)
- [ ] Product database / barcode scanning
- [ ] Cloud sync / account system
- [ ] Historical tracking / charts
- [ ] Recipe suggestions
- [ ] Mobile app (PWA support not yet implemented)
- [ ] Offline mode (requires AI endpoint)

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (ES Modules)
- **Backend**: None (runs entirely in the browser)
- **Storage**: localStorage for meal plans and goals
- **AI**: OpenAI-compatible API for OCR extraction

## License

Free and open source. No ads, no tracking, no subscriptions.