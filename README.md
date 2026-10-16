# Cafe Avalon — AI Google Review Generator

A lightweight, responsive web application that helps customers generate personalized, authentic Google review drafts using Google's Gemini AI (with built-in multilingual support and offline fallback).

## Features
- **3 Draft Variations**: Warm & Friendly, Straightforward, and Enthusiastic.
- **Multilingual**: Supports English, Hindi (हिंदी), and Marathi (मराठी).
- **Gemini AI Integration**: Uses `gemini-2.5-flash` with zero hallucination guidelines.
- **Offline Fallback**: Automatically generates templates if offline or API limit is exceeded.
- **Copy & Edit**: One-click copy to clipboard with in-place draft editing.

## Setup Instructions

1. **Clone or Download** the repository.
2. **Setup Config**:
   Copy or rename `config.example.js` to `config.js`:
   ```bash
   cp config.example.js config.js
   ```
3. **Add Gemini API Key**:
   Open `config.js` and insert your API key from [Google AI Studio](https://aistudio.google.com/):
   ```javascript
   geminiApiKey: "YOUR_GEMINI_API_KEY_HERE",
   ```
4. **Run Locally**:
   Run any static local server (e.g., Python or Node):
   ```bash
   # Using Python
   python -m http.server 3737

   # Or using npx serve
   npx serve .
   ```
5. Open your browser and visit: `http://localhost:3737`
