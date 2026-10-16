/**
 * ============================================================
 *  mockAI.js — Review draft generator
 *
 *  When CAFE_CONFIG.useRealAI === true  → calls Gemini API
 *  When CAFE_CONFIG.useRealAI === false → uses offline templates
 *
 *  The exported generateDrafts() function signature never changes,
 *  so the rest of the app is unaffected by this module's internals.
 * ============================================================
 */

/* ══════════════════════════════════════════════════════════════
   GEMINI API IMPLEMENTATION
══════════════════════════════════════════════════════════════ */

/**
 * Builds the prompt for Gemini.
 * The prompt is written carefully to:
 *  - Only use what the customer actually provided
 *  - Never invent facts, claims or experiences
 *  - Produce three clearly distinct tones
 *  - Respond ONLY with a valid JSON array (no markdown fences)
 */
function buildGeminiPrompt({ lang, stars, orderedItem, serviceRating, standouts, businessName }) {
  const langNames = { en: "English", hi: "Hindi", mr: "Marathi" };
  const langName  = langNames[lang] || "English";

  const ratingContext = {
    1: "1 out of 5 stars — very dissatisfied",
    2: "2 out of 5 stars — somewhat dissatisfied",
    3: "3 out of 5 stars — average / neutral",
    4: "4 out of 5 stars — satisfied",
    5: "5 out of 5 stars — very satisfied / excellent"
  }[stars] || `${stars} out of 5 stars`;

  const serviceContext  = serviceRating  || "not specified by the customer";
  const standoutContext = standouts && standouts.length > 0
    ? standouts.join(", ")
    : "none specified by the customer";

  return `You are a helpful review-writing assistant for ${businessName}, a coffee shop.

A customer answered a few quick questions about their visit. Your job is to turn their answers into three distinct Google review drafts.

CUSTOMER INPUT:
- What they ordered: "${orderedItem}"
- Overall star rating: ${ratingContext}
- How was the service: ${serviceContext}
- What stood out: ${standoutContext}

STRICT RULES — follow every rule or the output is invalid:
1. Write all three drafts in ${langName} only.
2. Use ONLY information the customer provided. Do NOT invent any details, claims, menu items, prices, or experiences the customer did not mention.
3. Do NOT claim the review has been published or submitted.
4. Do NOT make the review sound artificially positive if the rating is low. Keep tone honest and proportional to the star rating.
5. Each draft must feel clearly different in style:
   - Draft 1 tone: "Warm & Friendly" — personal, conversational, warm
   - Draft 2 tone: "Straightforward" — factual, concise, neutral
   - Draft 3 tone: "Enthusiastic" — expressive, lively (but proportional to the actual rating)
6. Each draft should be 2–4 sentences. Do not pad with filler sentences.
7. Include the business name "${businessName}" naturally in each draft.
8. If service or standout information was provided, weave it in naturally — do not force it.

OUTPUT FORMAT — respond with ONLY a raw JSON array, no markdown, no code fences, no explanation:
[
  { "tone": "<tone label in ${langName}>", "text": "<draft 1 text>" },
  { "tone": "<tone label in ${langName}>", "text": "<draft 2 text>" },
  { "tone": "<tone label in ${langName}>", "text": "<draft 3 text>" }
]`;
}

/**
 * Calls the Gemini generateContent REST API.
 */
async function callGeminiAPI({ lang, stars, orderedItem, serviceRating, standouts, businessName }) {
  const config = window.CAFE_CONFIG || {};
  const apiKey = config.geminiApiKey;
  const model  = config.geminiModel || "gemini-2.5-flash";
  const url    = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = buildGeminiPrompt({ lang, stars, orderedItem, serviceRating, standouts, businessName });

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature:     0.75,
      topP:            0.9,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
      thinkingConfig:  { thinkingBudget: 0 }
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
    ]
  };

  const response = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();

  // Extract the raw text from the response
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Gemini returned an empty response.");

  // Extract JSON array from response
  let cleaned = rawText.trim();
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  } else {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  }

  let drafts;
  try {
    drafts = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Could not parse Gemini JSON response: ${cleaned}`);
  }

  if (!Array.isArray(drafts) || drafts.length === 0) {
    throw new Error("Gemini returned an unexpected format.");
  }

  return drafts.map(d => ({
    tone: d.tone || "Draft",
    text: d.text || ""
  }));
}


/* ══════════════════════════════════════════════════════════════
   OFFLINE FALLBACK (used when useRealAI === false)
══════════════════════════════════════════════════════════════ */

const TONE_META = {
  en: [
    { label: "Warm & Friendly",  style: "warm"   },
    { label: "Straightforward",  style: "direct" },
    { label: "Enthusiastic",     style: "lively" }
  ],
  hi: [
    { label: "स्नेही",           style: "warm"   },
    { label: "सीधा-सादा",        style: "direct" },
    { label: "उत्साहपूर्ण",      style: "lively" }
  ],
  mr: [
    { label: "आपुलकीचे",         style: "warm"   },
    { label: "सरळ-साधे",        style: "direct" },
    { label: "उत्साही",          style: "lively" }
  ]
};

const SENTIMENT = {
  en: {
    1: { overall: "unfortunately didn't live up to expectations" },
    2: { overall: "had some room for improvement" },
    3: { overall: "was a fairly average experience" },
    4: { overall: "was a solid visit" },
    5: { overall: "was an excellent experience" }
  },
  hi: {
    1: { overall: "उम्मीदों पर खरी नहीं उतरी" },
    2: { overall: "सुधार की गुंजाइश थी" },
    3: { overall: "एक औसत अनुभव रही" },
    4: { overall: "एक अच्छी विज़िट रही" },
    5: { overall: "एक बेहतरीन अनुभव रही" }
  },
  mr: {
    1: { overall: "अपेक्षांपर्यंत पोहोचली नाही" },
    2: { overall: "सुधारणेची जागा होती" },
    3: { overall: "एक साधारण अनुभव होता" },
    4: { overall: "एक चांगली भेट होती" },
    5: { overall: "एक उत्कृष्ट अनुभव होता" }
  }
};

const ATTR_SNIPPETS = {
  en: {
    coffeeFood:     ["the coffee and food quality", "the drinks and food"],
    staffBehaviour: ["the staff friendliness", "the team"],
    cleanliness:    ["cleanliness", "the overall tidiness"],
    ambience:       ["the ambience", "the vibe of the cafe"],
    serviceSpeed:   ["service speed", "the prompt service"]
  },
  hi: {
    coffeeFood:     ["कॉफी और खाने की गुणवत्ता", "पेय और खाना"],
    staffBehaviour: ["स्टाफ का व्यवहार", "टीम"],
    cleanliness:    ["साफ-सफाई", "स्वच्छता"],
    ambience:       ["माहौल", "कैफे का वातावरण"],
    serviceSpeed:   ["सर्विस की गति", "तेज़ सेवा"]
  },
  mr: {
    coffeeFood:     ["कॉफी आणि खाण्याची गुणवत्ता", "पेय आणि अन्न"],
    staffBehaviour: ["कर्मचाऱ्यांचे वर्तन", "टीम"],
    cleanliness:    ["स्वच्छता", "एकूण नीटनेटकेपणा"],
    ambience:       ["वातावरण", "कॅफेचा माहोल"],
    serviceSpeed:   ["सेवेचा वेग", "जलद सेवा"]
  }
};

function buildAttrMentions(lang, selectedAttrs, variantIndex) {
  if (!selectedAttrs) return "";
  const list = Array.isArray(selectedAttrs) ? selectedAttrs : [selectedAttrs];
  const validList = list.filter(item => typeof item === "string" && item.trim().length > 0);
  if (validList.length === 0) return "";
  const snippets = ATTR_SNIPPETS[lang] || ATTR_SNIPPETS.en;
  const parts = validList.map(attr => {
    const options = snippets[attr] || [attr];
    return options[variantIndex % options.length];
  });
  if (lang === "en") {
    const joined = parts.length === 1
      ? parts[0]
      : parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
    return joined.charAt(0).toUpperCase() + joined.slice(1);
  }
  return parts.join(", ");
}

function buildOfflineDrafts(lang, stars, orderedItem, serviceRating, standouts, businessName) {
  // Support both 5-argument and 6-argument calls
  if (arguments.length === 5) {
    businessName = standouts;
    standouts = Array.isArray(serviceRating) ? serviceRating : (serviceRating ? [serviceRating] : []);
    serviceRating = "";
  }
  businessName = businessName || "Cafe Avalon";
  const numStars = Math.max(1, Math.min(5, parseInt(stars, 10) || 5));
  const sentimentDict = SENTIMENT[lang] || SENTIMENT.en;
  const s = sentimentDict[numStars] || sentimentDict[5] || { overall: "was a great experience" };
  const tones = TONE_META[lang] || TONE_META.en;
  const body = (orderedItem || "").trim();
  const serviceText = typeof serviceRating === "string" && serviceRating.trim() ? serviceRating.trim() : "";

  const warm = (() => {
    const attr = buildAttrMentions(lang, standouts, 0);
    if (lang === "hi") {
      const open = numStars >= 4 ? `अभी-अभी ${businessName} में एक बहुत अच्छी विज़िट की!` : `हाल ही में ${businessName} गया/गई।`;
      const itemL = body ? ` हमने "${body}" ट्राई किया।` : "";
      const srvL = serviceText ? ` सर्विस ${serviceText} थी।` : "";
      const attrL = attr ? ` ${attr} बहुत अच्छा था।` : "";
      const close = numStars >= 4 ? ` कुल मिलाकर यह ${s.overall} — ज़रूर जाएं!` : ` कुल मिलाकर यह ${s.overall}।`;
      return `${open}${itemL}${srvL}${attrL}${close}`;
    }
    if (lang === "mr") {
      const open = numStars >= 4 ? `नुकतीच ${businessName} ला एक छान भेट दिली!` : `अलीकडेच ${businessName} ला भेट दिली.`;
      const itemL = body ? ` आम्ही "${body}" ऑर्डर केले होते.` : "";
      const srvL = serviceText ? ` सर्विस ${serviceText} होती.` : "";
      const attrL = attr ? ` ${attr} खूप चांगले होते.` : "";
      const close = numStars >= 4 ? ` एकंदरीत ही ${s.overall} — नक्की जा!` : ` एकंदरीत ही ${s.overall}.`;
      return `${open}${itemL}${srvL}${attrL}${close}`;
    }
    const open = numStars >= 4 ? `Just had a lovely visit to ${businessName}!` : `Visited ${businessName} recently.`;
    const itemL = body ? ` Ordered the ${body}.` : "";
    const srvL = serviceText ? ` Service was ${serviceText}.` : "";
    const attrL = attr ? ` ${attr} really stood out.` : "";
    const close = numStars >= 4 ? ` Overall it ${s.overall} — would recommend!` : ` Overall it ${s.overall}.`;
    return `${open}${itemL}${srvL}${attrL}${close}`;
  })();

  const direct = (() => {
    const attr = buildAttrMentions(lang, standouts, 1);
    if (lang === "hi") {
      const itemL = body ? ` ऑर्डर: ${body}।` : "";
      const srvL = serviceText ? ` सर्विस: ${serviceText}।` : "";
      const attrL = attr ? ` उल्लेखनीय: ${attr}।` : "";
      const close = numStars >= 4 ? " अच्छी जगह।" : numStars <= 2 ? " सुधार जरूरी।" : " औसत।";
      return `${businessName} — ${numStars}/5 स्टार।${itemL}${srvL}${attrL}${close}`;
    }
    if (lang === "mr") {
      const itemL = body ? ` ऑर्डर: ${body}.` : "";
      const srvL = serviceText ? ` सेवा: ${serviceText}.` : "";
      const attrL = attr ? ` उल्लेखनीय: ${attr}.` : "";
      const close = numStars >= 4 ? " चांगली जागा." : numStars <= 2 ? " सुधारणा आवश्यक." : " साधारण.";
      return `${businessName} — ${numStars}/5 तारे.${itemL}${srvL}${attrL}${close}`;
    }
    const itemL = body ? ` Ordered: ${body}.` : "";
    const srvL = serviceText ? ` Service: ${serviceText}.` : "";
    const attrL = attr ? ` Worth mentioning: ${attr}.` : "";
    const close = numStars >= 4 ? " Good spot." : numStars <= 2 ? " Needs improvement." : " Average overall.";
    return `${businessName} — ${numStars}/5 stars.${itemL}${srvL}${attrL}${close}`;
  })();

  const lively = (() => {
    const attr = buildAttrMentions(lang, standouts, 0);
    const em = numStars === 5 ? "🌟 " : numStars === 4 ? "☕ " : "";
    if (lang === "hi") {
      const open = numStars >= 4 ? `${em}${businessName} ज़रूर जाएं!` : `${businessName} में अनुभव:`;
      const itemL = body ? ` "${body}" का स्वाद बहुत बढ़िया लगा!` : "";
      const srvL = serviceText ? ` स्टाफ और सर्विस ${serviceText} रहे!` : "";
      const attrL = attr ? ` खास ज़िक्र: ${attr}।` : "";
      const close = numStars >= 4 ? " वापस जरूर आऊंगा/आऊंगी!" : numStars <= 2 ? " उम्मीद है सुधार होगा।" : " ठीक-ठाक जगह है।";
      return `${open}${itemL}${srvL}${attrL}${close}`;
    }
    if (lang === "mr") {
      const open = numStars >= 4 ? `${em}${businessName} नक्की भेट द्या!` : `${businessName} मधील अनुभव:`;
      const itemL = body ? ` "${body}" खूप छान होते!` : "";
      const srvL = serviceText ? ` स्टाफ आणि सेवा ${serviceText} होती!` : "";
      const attrL = attr ? ` विशेष उल्लेख: ${attr}.` : "";
      const close = numStars >= 4 ? " नक्की परत येणार!" : numStars <= 2 ? " सुधारणा व्हावी अशी आशा." : " एकदा जाण्यासारखे.";
      return `${open}${itemL}${srvL}${attrL}${close}`;
    }
    const open = numStars >= 4 ? `${em}Highly recommend ${businessName}!` : `My experience at ${businessName}:`;
    const itemL = body ? ` Loved the ${body}!` : "";
    const srvL = serviceText ? ` Service was ${serviceText}!` : "";
    const attrL = attr ? ` Special mention: ${attr}.` : "";
    const close = numStars >= 4 ? " Definitely coming back!" : numStars <= 2 ? " Hoping things improve." : " Decent place to try.";
    return `${open}${itemL}${srvL}${attrL}${close}`;
  })();

  return [
    { tone: tones[0]?.label || "Warm & Friendly", text: warm },
    { tone: tones[1]?.label || "Straightforward",  text: direct },
    { tone: tones[2]?.label || "Enthusiastic",     text: lively }
  ];
}


/* ══════════════════════════════════════════════════════════════
   PUBLIC API
══════════════════════════════════════════════════════════════ */

/**
 * generateDrafts()
 * @param {object} input
 * @param {string}   input.lang           - 'en' | 'hi' | 'mr'
 * @param {number}   input.stars          - 1–5
 * @param {string}   input.orderedItem    - what the customer ordered
 * @param {string}   input.serviceRating  - selected service label
 * @param {string[]} input.standouts      - selected standout labels
 * @param {string}   input.businessName
 * @returns {Promise<Array<{tone: string, text: string}>>}
 */
async function generateDrafts({ lang, stars, orderedItem, serviceRating, standouts, businessName }) {
  const config = window.CAFE_CONFIG || {};
  const apiKey = (config.geminiApiKey || "").trim();
  const hasRealKey = Boolean(apiKey && !apiKey.includes("YOUR_") && apiKey.length > 10);

  if (config.useRealAI && hasRealKey) {
    return callGeminiAPI({ lang, stars, orderedItem, serviceRating, standouts, businessName });
  }
  await new Promise(resolve => setTimeout(resolve, 800));
  return buildOfflineDrafts(lang, stars, orderedItem, serviceRating, standouts, businessName);
}
