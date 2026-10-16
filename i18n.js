/**
 * ============================================================
 *  i18n.js — Translations for English, Hindi, and Marathi
 *  All UI strings live here. The app never hard-codes text.
 * ============================================================
 */

const I18N = {

  /* ══════════════════════════════════════════════════════════
     ENGLISH
  ══════════════════════════════════════════════════════════ */
  en: {
    langName: "English",
    langCode: "en",

    /* Header */
    headerTagline: "How was your visit?",
    headerSubtitle: "Help others discover us by sharing your experience.",

    /* Step labels */
    step1Label: "Your Rating",
    step2Label: "Your Experience",
    step3Label: "Review Drafts",

    /* Step 1 – Rating */
    ratingPrompt: "Tap the stars to rate your visit",
    ratingLabels: ["Terrible", "Poor", "Okay", "Good", "Excellent"],
    ratingRequired: "Please select a star rating to continue.",

    /* Step 2 – Order input */
    expTitle: "Tell us about your visit",
    orderLabel: "What did you order?",
    orderHint: "Just the item name is fine — e.g. Cappuccino, Cold Coffee, Sandwich",
    orderPlaceholder: "e.g. Cappuccino",
    orderRequired: "Please tell us what you ordered.",

    /* Step 2 – Service chips (single-select) */
    serviceLabel: "How was the service?",
    serviceOptions: {
      excellent:   "Excellent 🌟",
      good:        "Good 👍",
      average:     "Okay 😐",
      slow:        "Slow ⏳",
      unfriendly:  "Could be better 😕"
    },

    /* Step 2 – Stand-out chips (multi-select, optional) */
    standoutLabel: "What stood out?",
    standoutOptional: "(optional)",
    standoutOptions: {
      coffeeQuality:  "☕ Coffee Quality",
      foodQuality:    "🍽️ Food Quality",
      friendlyStaff:  "🤝 Friendly Staff",
      cleanliness:    "✨ Cleanliness",
      ambience:       "🌿 Ambience & Vibe",
      quickService:   "⚡ Quick Service",
      goodValue:      "💰 Good Value",
      presentation:   "🎨 Presentation"
    },

    /* Step 3 – Drafts */
    draftsTitle: "Your Review Drafts",
    draftsSubtitle: "Three versions based on your input. Pick the one that feels right — or edit it to make it yours.",
    draftLabel: "Draft",
    editDraft: "Edit",
    copyDraft: "Copy",
    copied: "Copied!",
    saveDraft: "Save",
    discardEdit: "Cancel",
    editPlaceholder: "Edit the draft here…",

    /* Google Review CTA */
    postReviewTitle: "Ready to post?",
    postReviewSubtitle: "Copy your chosen draft, then click the button below to open Google Reviews.",
    openGoogleReview: "Open Google Reviews →",
    googleUrlMissing: "⚠ Google Review URL not configured yet. Please contact the administrator.",
    reminderNote: "Note: Clicking the button opens Google — your review is not submitted automatically.",

    /* Misc */
    mockBadge: "Demo — Mock AI",
    generateBtn: "Generate Review Drafts",
    generating: "Generating drafts…",
    backBtn: "Back",
    nextBtn: "Next",
    startOver: "Start over",
    poweredBy: "Powered by AI"
  },

  /* ══════════════════════════════════════════════════════════
     HINDI
  ══════════════════════════════════════════════════════════ */
  hi: {
    langName: "हिन्दी",
    langCode: "hi",

    headerTagline: "आपकी विज़िट कैसी रही?",
    headerSubtitle: "अपना अनुभव साझा करके दूसरों की मदद करें।",

    step1Label: "आपकी रेटिंग",
    step2Label: "आपका अनुभव",
    step3Label: "समीक्षा के मसौदे",

    ratingPrompt: "अपनी विज़िट को रेट करने के लिए स्टार पर टैप करें",
    ratingLabels: ["बहुत खराब", "खराब", "ठीक है", "अच्छा", "बेहतरीन"],
    ratingRequired: "जारी रखने के लिए कृपया स्टार रेटिंग चुनें।",

    expTitle: "अपनी विज़िट के बारे में बताएं",
    orderLabel: "आपने क्या ऑर्डर किया?",
    orderHint: "बस आइटम का नाम लिखें — जैसे कैपुचिनो, कोल्ड कॉफी, सैंडविच",
    orderPlaceholder: "जैसे कैपुचिनो",
    orderRequired: "कृपया बताएं कि आपने क्या ऑर्डर किया।",

    serviceLabel: "सर्विस कैसी थी?",
    serviceOptions: {
      excellent:   "बेहतरीन 🌟",
      good:        "अच्छी 👍",
      average:     "ठीक-ठाक 😐",
      slow:        "धीमी ⏳",
      unfriendly:  "बेहतर हो सकती थी 😕"
    },

    standoutLabel: "क्या खास लगा?",
    standoutOptional: "(वैकल्पिक)",
    standoutOptions: {
      coffeeQuality:  "☕ कॉफी की गुणवत्ता",
      foodQuality:    "🍽️ खाने की गुणवत्ता",
      friendlyStaff:  "🤝 मिलनसार स्टाफ",
      cleanliness:    "✨ साफ-सफाई",
      ambience:       "🌿 माहौल और वातावरण",
      quickService:   "⚡ तेज़ सर्विस",
      goodValue:      "💰 अच्छी कीमत",
      presentation:   "🎨 प्रस्तुति"
    },

    draftsTitle: "आपके समीक्षा के मसौदे",
    draftsSubtitle: "आपके जवाबों पर आधारित तीन संस्करण। जो सही लगे उसे चुनें — या संपादित करें।",
    draftLabel: "मसौदा",
    editDraft: "संपादित करें",
    copyDraft: "कॉपी करें",
    copied: "कॉपी हो गया!",
    saveDraft: "सहेजें",
    discardEdit: "रद्द करें",
    editPlaceholder: "यहाँ मसौदा संपादित करें…",

    postReviewTitle: "पोस्ट करने के लिए तैयार हैं?",
    postReviewSubtitle: "अपनी पसंदीदा समीक्षा कॉपी करें, फिर नीचे दिए बटन पर क्लिक करें।",
    openGoogleReview: "Google समीक्षा खोलें →",
    googleUrlMissing: "⚠ Google समीक्षा URL अभी तक कॉन्फ़िगर नहीं किया गया। कृपया व्यवस्थापक से संपर्क करें।",
    reminderNote: "नोट: बटन क्लिक करने पर Google खुलता है — आपकी समीक्षा स्वचालित रूप से सबमिट नहीं होती।",

    mockBadge: "डेमो — नकली AI",
    generateBtn: "समीक्षा के मसौदे बनाएं",
    generating: "मसौदे तैयार हो रहे हैं…",
    backBtn: "वापस",
    nextBtn: "आगे",
    startOver: "फिर से शुरू करें",
    poweredBy: "AI द्वारा संचालित"
  },

  /* ══════════════════════════════════════════════════════════
     MARATHI
  ══════════════════════════════════════════════════════════ */
  mr: {
    langName: "मराठी",
    langCode: "mr",

    headerTagline: "तुमची भेट कशी होती?",
    headerSubtitle: "तुमचा अनुभव सांगून इतरांना मदत करा.",

    step1Label: "तुमची रेटिंग",
    step2Label: "तुमचा अनुभव",
    step3Label: "समीक्षेचे मसुदे",

    ratingPrompt: "तुमची भेट रेट करण्यासाठी ताऱ्यावर टॅप करा",
    ratingLabels: ["खूप वाईट", "वाईट", "ठीक आहे", "चांगले", "उत्कृष्ट"],
    ratingRequired: "कृपया पुढे जाण्यासाठी स्टार रेटिंग निवडा.",

    expTitle: "तुमच्या भेटीबद्दल सांगा",
    orderLabel: "तुम्ही काय ऑर्डर केले?",
    orderHint: "फक्त आयटमचे नाव लिहा — उदा. कॅपुचिनो, कोल्ड कॉफी, सँडविच",
    orderPlaceholder: "उदा. कॅपुचिनो",
    orderRequired: "कृपया तुम्ही काय ऑर्डर केले ते सांगा.",

    serviceLabel: "सेवा कशी होती?",
    serviceOptions: {
      excellent:   "उत्कृष्ट 🌟",
      good:        "चांगली 👍",
      average:     "ठीक आहे 😐",
      slow:        "संथ ⏳",
      unfriendly:  "सुधारणा हवी 😕"
    },

    standoutLabel: "काय विशेष वाटले?",
    standoutOptional: "(पर्यायी)",
    standoutOptions: {
      coffeeQuality:  "☕ कॉफीची गुणवत्ता",
      foodQuality:    "🍽️ खाण्याची गुणवत्ता",
      friendlyStaff:  "🤝 मैत्रीपूर्ण कर्मचारी",
      cleanliness:    "✨ स्वच्छता",
      ambience:       "🌿 वातावरण",
      quickService:   "⚡ जलद सेवा",
      goodValue:      "💰 चांगला मोबदला",
      presentation:   "🎨 सादरीकरण"
    },

    draftsTitle: "तुमच्या समीक्षेचे मसुदे",
    draftsSubtitle: "तुमच्या उत्तरांवर आधारित तीन आवृत्त्या. योग्य वाटेल ते निवडा — किंवा संपादित करा.",
    draftLabel: "मसुदा",
    editDraft: "संपादित करा",
    copyDraft: "कॉपी करा",
    copied: "कॉपी झाले!",
    saveDraft: "जतन करा",
    discardEdit: "रद्द करा",
    editPlaceholder: "येथे मसुदा संपादित करा…",

    postReviewTitle: "पोस्ट करायला तयार आहात?",
    postReviewSubtitle: "तुमची निवडलेली समीक्षा कॉपी करा, नंतर खालील बटण क्लिक करा.",
    openGoogleReview: "Google समीक्षा उघडा →",
    googleUrlMissing: "⚠ Google समीक्षा URL अद्याप कॉन्फिगर केलेले नाही. कृपया प्रशासकाशी संपर्क साधा.",
    reminderNote: "टीप: बटण क्लिक केल्यावर Google उघडते — तुमची समीक्षा आपोआप सबमिट होत नाही.",

    mockBadge: "डेमो — नकली AI",
    generateBtn: "समीक्षेचे मसुदे तयार करा",
    generating: "मसुदे तयार होत आहेत…",
    backBtn: "मागे",
    nextBtn: "पुढे",
    startOver: "पुन्हा सुरू करा",
    poweredBy: "AI द्वारे चालित"
  }
};
