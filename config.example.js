/**
 * ============================================================
 *  CAFE AVALON — BUSINESS CONFIGURATION (TEMPLATE)
 *  Rename or copy this file to config.js and add your Gemini API key.
 * ============================================================
 */

const CAFE_CONFIG = {

  /* ── Business Identity ───────────────────────────────────── */
  businessName: "Cafe Avalon",
  businessType: "Coffee Shop",
  address: "Opposite Rane Complex, CIDCO Waluj Mahanagar 1, Tisgaon, Chhatrapati Sambhajinagar, Maharashtra 431136",

  /* ── Google Review URL ───────────────────────────────────── */
  // Replace the placeholder below with your direct Google review-submission link:
  // Format is typically:
  //   https://search.google.com/local/writereview?placeid=<PLACE_ID>
  // or the short form:
  //   https://g.page/r/<PLACE_ID>/review
  googleReviewUrl: "GOOGLE_REVIEW_URL_PLACEHOLDER",

  /* ── Supported Languages ─────────────────────────────────── */
  supportedLanguages: ["en", "hi", "mr"],
  defaultLanguage: "en",

  /* ── Service Rating Options ──────────────────────────────── */
  serviceOptionKeys: ["excellent", "good", "average", "slow", "unfriendly"],

  /* ── Stand-out Highlight Options ─────────────────────────── */
  standoutKeys: ["coffeeQuality", "foodQuality", "friendlyStaff", "cleanliness", "ambience", "quickService", "goodValue", "presentation"],

  /* ── AI / Mock Settings ──────────────────────────────────── */
  // Gemini API key — get one from https://aistudio.google.com/
  geminiApiKey: "YOUR_GEMINI_API_KEY_HERE",

  // Gemini model to use. gemini-2.5-flash is fast and cost-efficient.
  geminiModel: "gemini-2.5-flash",

  // Set to true to use real Gemini AI, or false for offline templates.
  useRealAI: true,

  // Number of review drafts to generate.
  draftCount: 3,

  /* ── App Meta ────────────────────────────────────────────── */
  appVersion: "1.0.0",
  buildNote: "Gemini AI mode"
};

// Freeze so nothing mutates the config at runtime.
Object.freeze(CAFE_CONFIG);
