/**
 * ============================================================
 *  app.js — Cafe Avalon Review Assistant
 *  Main application logic
 * ============================================================
 */

/* ── State ───────────────────────────────────────────────── */
const state = {
  lang:          CAFE_CONFIG.defaultLanguage,
  currentStep:   1,
  stars:         0,
  orderedItem:   "",   // what the customer ordered (short text)
  serviceRating: "",   // key of selected service chip
  standouts:     [],   // keys of selected standout chips
  drafts:        []
};

/* ── DOM references ──────────────────────────────────────── */
let DOM = {};

/* ── i18n helper ─────────────────────────────────────────── */
function t(key, ...args) {
  const lang = I18N[state.lang] || I18N[CAFE_CONFIG.defaultLanguage];
  let val = lang[key];
  if (val === undefined) {
    const fallback = I18N[CAFE_CONFIG.defaultLanguage];
    val = fallback[key] ?? key;
  }
  if (typeof val === "string" && args.length) {
    args.forEach((a, i) => { val = val.replace(`{${i}}`, a); });
  }
  return val;
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  buildLangBar();
  renderAll();
  bindEvents();
});

function cacheDom() {
  DOM = {
    langBar:           document.getElementById("lang-bar"),
    mockBadge:         document.getElementById("mock-badge"),
    headerTagline:     document.getElementById("header-tagline"),
    headerSubtitle:    document.getElementById("header-subtitle"),
    businessName:      document.querySelectorAll(".business-name"),
    stepperItems:      document.querySelectorAll(".step-item"),
    stepLabels:        document.querySelectorAll(".step-label"),

    /* Step 1 */
    step1:             document.getElementById("step-1"),
    stars:             document.querySelectorAll(".star-btn"),
    ratingLabel:       document.getElementById("rating-label"),
    starValueDisplay:  document.getElementById("star-value-display"),
    ratingPrompt:      document.getElementById("rating-prompt"),
    ratingError:       document.getElementById("rating-error"),
    nextStep1:         document.getElementById("next-step-1"),

    /* Step 2 */
    step2:             document.getElementById("step-2"),
    expTitle:          document.getElementById("exp-title"),
    orderLabel:        document.getElementById("order-label"),
    orderHint:         document.getElementById("order-hint"),
    orderInput:        document.getElementById("order-input"),
    orderError:        document.getElementById("order-error"),
    serviceLabel:      document.getElementById("service-label"),
    serviceChips:      document.getElementById("service-chips"),
    standoutLabel:     document.getElementById("standout-label"),
    standoutOptional:  document.getElementById("standout-optional"),
    standoutGrid:      document.getElementById("standout-grid"),
    backStep2:         document.getElementById("back-step-2"),
    generateBtn:       document.getElementById("generate-btn"),

    /* Step 3 */
    step3:             document.getElementById("step-3"),
    draftsHeaderTitle: document.getElementById("drafts-header-title"),
    draftsHeaderSub:   document.getElementById("drafts-header-sub"),
    generatingOverlay: document.getElementById("generating-overlay"),
    generatingText:    document.getElementById("generating-text"),
    draftsContainer:   document.getElementById("drafts-container"),
    googleCta:         document.getElementById("google-cta"),
    ctaTitle:          document.getElementById("cta-title"),
    ctaSubtitle:       document.getElementById("cta-subtitle"),
    googleBtn:         document.getElementById("google-review-btn"),
    googleBtnLabel:    document.getElementById("google-btn-label"),
    urlMissingNote:    document.getElementById("url-missing-note"),
    reminderNote:      document.getElementById("reminder-note"),
    startOverRow:      document.getElementById("start-over-row"),
    startOverBtn:      document.getElementById("start-over-btn"),

    toast:             document.getElementById("toast")
  };
}

/* ── Language bar ────────────────────────────────────────── */
function buildLangBar() {
  const bar = DOM.langBar;
  bar.innerHTML = "";
  CAFE_CONFIG.supportedLanguages.forEach(code => {
    const langData = I18N[code];
    const btn = document.createElement("button");
    btn.className = "lang-btn" + (code === state.lang ? " active" : "");
    btn.dataset.lang = code;
    btn.textContent = langData.langName;
    btn.setAttribute("aria-label", `Switch to ${langData.langName}`);
    btn.addEventListener("click", () => setLang(code));
    bar.appendChild(btn);
  });
}

function setLang(code) {
  state.lang = code;
  document.documentElement.lang = code;
  buildLangBar();
  renderAll();
}

/* ── Render all text strings ─────────────────────────────── */
function renderAll() {
  // Business names
  DOM.businessName.forEach(el => { el.textContent = CAFE_CONFIG.businessName; });

  // Badge
  if (CAFE_CONFIG.useRealAI) {
    DOM.mockBadge.textContent = "✨ AI-Powered";
    DOM.mockBadge.style.background   = "rgba(76,175,114,0.12)";
    DOM.mockBadge.style.borderColor  = "rgba(76,175,114,0.4)";
    DOM.mockBadge.style.color        = "#4caf72";
  } else {
    DOM.mockBadge.textContent = t("mockBadge");
    DOM.mockBadge.style.background = DOM.mockBadge.style.borderColor = DOM.mockBadge.style.color = "";
  }

  // Header
  DOM.headerTagline.textContent  = t("headerTagline");
  DOM.headerSubtitle.textContent = t("headerSubtitle");

  // Stepper labels
  const labels = [t("step1Label"), t("step2Label"), t("step3Label")];
  DOM.stepLabels.forEach((el, i) => { el.textContent = labels[i]; });

  // Step 1
  DOM.ratingPrompt.textContent = t("ratingPrompt");
  updateRatingLabel();
  document.querySelector("#next-step-1 .btn-label").textContent = t("nextBtn") + " →";

  // Step 2
  DOM.expTitle.textContent      = t("expTitle");
  DOM.orderLabel.textContent    = t("orderLabel");
  DOM.orderHint.textContent     = t("orderHint");
  DOM.orderInput.placeholder    = t("orderPlaceholder");
  DOM.serviceLabel.textContent  = t("serviceLabel");
  renderServiceChips();
  // standout label: rebuild including optional tag
  const soTag = `<span class="optional-tag" id="standout-optional">${t("standoutOptional")}</span>`;
  DOM.standoutLabel.innerHTML   = `${t("standoutLabel")} ${soTag}`;
  renderStandoutChips();
  DOM.backStep2.textContent     = "← " + t("backBtn");
  DOM.generateBtn.querySelector(".btn-label").textContent = t("generateBtn");

  // Step 3
  DOM.draftsHeaderTitle.textContent = t("draftsTitle");
  DOM.draftsHeaderSub.textContent   = t("draftsSubtitle");
  DOM.generatingText.textContent    = t("generating");
  DOM.ctaTitle.textContent          = t("postReviewTitle");
  DOM.ctaSubtitle.textContent       = t("postReviewSubtitle");
  renderGoogleBtn();
  DOM.reminderNote.textContent      = t("reminderNote");
  const backStep3 = document.getElementById("back-step-3");
  if (backStep3) backStep3.textContent = "← " + t("backBtn");
  DOM.startOverBtn.textContent      = t("startOver");

  updateStepper();
}

/* ── Service chips (single-select) ───────────────────────── */
function renderServiceChips() {
  const container = DOM.serviceChips;
  container.innerHTML = "";
  const options = t("serviceOptions");
  CAFE_CONFIG.serviceOptionKeys.forEach(key => {
    const isSelected = state.serviceRating === key;
    const chip = document.createElement("button");
    chip.className = "service-chip" + (isSelected ? " selected" : "");
    chip.type = "button";
    chip.role = "radio";
    chip.setAttribute("aria-checked", isSelected);
    chip.dataset.key = key;
    chip.textContent = options[key] || key;
    chip.addEventListener("click", () => selectService(key));
    container.appendChild(chip);
  });
}

function selectService(key) {
  state.serviceRating = state.serviceRating === key ? "" : key; // tap again to deselect
  renderServiceChips();
}

/* ── Standout chips (multi-select) ───────────────────────── */
function renderStandoutChips() {
  const grid = DOM.standoutGrid;
  grid.innerHTML = "";
  const options = t("standoutOptions");
  CAFE_CONFIG.standoutKeys.forEach(key => {
    const isChecked = state.standouts.includes(key);
    const chip = document.createElement("button");
    chip.className = "standout-chip" + (isChecked ? " checked" : "");
    chip.type = "button";
    chip.setAttribute("role", "checkbox");
    chip.setAttribute("aria-checked", isChecked);
    chip.dataset.key = key;
    chip.textContent = options[key] || key;
    chip.addEventListener("click", () => toggleStandout(key, chip));
    grid.appendChild(chip);
  });
}

function toggleStandout(key, chip) {
  const idx = state.standouts.indexOf(key);
  if (idx === -1) {
    state.standouts.push(key);
    chip.classList.add("checked");
    chip.setAttribute("aria-checked", "true");
  } else {
    state.standouts.splice(idx, 1);
    chip.classList.remove("checked");
    chip.setAttribute("aria-checked", "false");
  }
}

/* ── Stepper ─────────────────────────────────────────────── */
function updateStepper() {
  DOM.stepperItems.forEach((item, idx) => {
    const stepNum = idx + 1;
    item.classList.remove("active", "done");
    if (stepNum < state.currentStep)   item.classList.add("done");
    if (stepNum === state.currentStep) item.classList.add("active");
    const numEl = item.querySelector(".step-number");
    if (numEl) numEl.textContent = stepNum;
  });
}

/* ── Steps navigation ────────────────────────────────────── */
function showStep(n) {
  state.currentStep = n;
  DOM.step1.classList.toggle("active", n === 1);
  DOM.step2.classList.toggle("active", n === 2);
  DOM.step3.classList.toggle("active", n === 3);
  updateStepper();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── Star rating ─────────────────────────────────────────── */
function updateRatingLabel() {
  const labels = t("ratingLabels");
  if (state.stars > 0) {
    DOM.ratingLabel.textContent      = labels[state.stars - 1];
    DOM.starValueDisplay.textContent = `${state.stars} / 5`;
  } else {
    DOM.ratingLabel.textContent      = "";
    DOM.starValueDisplay.textContent = "";
  }
}

function setStars(n) {
  state.stars = n;
  DOM.stars.forEach((btn, idx) => {
    btn.classList.toggle("selected", idx < n);
    btn.setAttribute("aria-checked", idx < n ? "true" : "false");
  });
  updateRatingLabel();
  hideError(DOM.ratingError);
}

/* ── Validation ──────────────────────────────────────────── */
function showError(el, msg) { el.textContent = msg; el.classList.add("visible"); }
function hideError(el)       { el.classList.remove("visible"); }

function validateStep1() {
  if (state.stars === 0) { showError(DOM.ratingError, t("ratingRequired")); return false; }
  hideError(DOM.ratingError);
  return true;
}

function validateStep2() {
  const item = DOM.orderInput.value.trim();
  if (!item) { showError(DOM.orderError, t("orderRequired")); DOM.orderInput.focus(); return false; }
  hideError(DOM.orderError);
  return true;
}

/* ── Generate drafts ─────────────────────────────────────── */
async function handleGenerate() {
  if (!validateStep2()) return;
  state.orderedItem = DOM.orderInput.value.trim();

  showStep(3);
  DOM.generatingOverlay.classList.add("visible");
  DOM.draftsContainer.innerHTML = "";
  DOM.googleCta.style.display   = "none";
  DOM.startOverRow.style.display = "none";

  // Build a human-readable experience summary for the AI
  const serviceLabel   = state.serviceRating
    ? (t("serviceOptions")[state.serviceRating] || state.serviceRating)
    : "";
  const standoutLabels = state.standouts.length > 0
    ? state.standouts.map(k => t("standoutOptions")[k] || k)
    : [];

  try {
    const drafts = await generateDrafts({
      lang:          state.lang,
      stars:         state.stars,
      orderedItem:   state.orderedItem,
      serviceRating: serviceLabel,
      standouts:     standoutLabels,
      businessName:  CAFE_CONFIG.businessName
    });
    state.drafts = drafts;
    DOM.generatingOverlay.classList.remove("visible");
    renderDrafts(drafts);
    DOM.googleCta.style.display    = "block";
    DOM.startOverRow.style.display = "block";
    setTimeout(() => {
      DOM.draftsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  } catch (err) {
    console.error("Gemini API error:", err);
    try {
      const fallback = buildOfflineDrafts(
        state.lang, state.stars, state.orderedItem,
        serviceLabel, standoutLabels, CAFE_CONFIG.businessName
      );
      state.drafts = fallback;
      DOM.generatingOverlay.classList.remove("visible");
      renderDrafts(fallback);
      DOM.googleCta.style.display    = "block";
      DOM.startOverRow.style.display = "block";
      showToast("⚠ AI unavailable — showing offline drafts");
    } catch (fallbackErr) {
      DOM.generatingOverlay.classList.remove("visible");
      DOM.draftsContainer.innerHTML = `<div class="field-error visible" style="padding:20px 24px;display:block;">Something went wrong. Please go back and try again.</div>`;
    }
  }
}

/* ── Render draft cards ──────────────────────────────────── */
function renderDrafts(drafts) {
  DOM.draftsContainer.innerHTML = "";
  drafts.forEach((draft, i) => {
    const card = document.createElement("div");
    card.className = "draft-card";
    card.dataset.index = i;
    card.style.animationDelay = `${i * 120}ms`;

    card.innerHTML = `
      <div class="draft-header">
        <span class="draft-number">${t("draftLabel")} ${i + 1}</span>
        <span class="draft-tone">${draft.tone}</span>
      </div>
      <div class="draft-body">
        <p class="draft-text" id="draft-text-${i}">${escapeHtml(draft.text)}</p>
        <textarea class="draft-edit-area" id="draft-edit-${i}" aria-label="${t("editPlaceholder")}">${escapeHtml(draft.text)}</textarea>
      </div>
      <div class="draft-actions">
        <button class="btn-draft-edit"    id="btn-edit-${i}"    data-idx="${i}">✏ ${t("editDraft")}</button>
        <button class="btn-draft-copy"    id="btn-copy-${i}"    data-idx="${i}">📋 ${t("copyDraft")}</button>
        <button class="btn-draft-save"    id="btn-save-${i}"    data-idx="${i}">✓ ${t("saveDraft")}</button>
        <button class="btn-draft-discard" id="btn-discard-${i}" data-idx="${i}">✕ ${t("discardEdit")}</button>
      </div>
    `;

    DOM.draftsContainer.appendChild(card);

    document.getElementById(`btn-edit-${i}`).addEventListener("click",    () => enterEditMode(i));
    document.getElementById(`btn-copy-${i}`).addEventListener("click",    () => copyDraft(i));
    document.getElementById(`btn-save-${i}`).addEventListener("click",    () => saveDraft(i));
    document.getElementById(`btn-discard-${i}`).addEventListener("click", () => discardEdit(i));
  });
}

function escapeHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* ── Draft edit / save / discard ─────────────────────────── */
function enterEditMode(i) {
  document.getElementById(`draft-text-${i}`).style.display   = "none";
  document.getElementById(`draft-edit-${i}`).style.display   = "block";
  document.getElementById(`draft-edit-${i}`).value           = state.drafts[i].text;
  document.getElementById(`btn-edit-${i}`).style.display     = "none";
  document.getElementById(`btn-copy-${i}`).style.display     = "none";
  document.getElementById(`btn-save-${i}`).style.display     = "inline-flex";
  document.getElementById(`btn-discard-${i}`).style.display  = "inline-flex";
  document.getElementById(`draft-edit-${i}`).focus();
}

function saveDraft(i) {
  const newText = document.getElementById(`draft-edit-${i}`).value.trim();
  if (!newText) return;
  state.drafts[i].text = newText;
  document.getElementById(`draft-text-${i}`).textContent = newText;
  exitEditMode(i);
}

function discardEdit(i) {
  document.getElementById(`draft-edit-${i}`).value = state.drafts[i].text;
  exitEditMode(i);
}

function exitEditMode(i) {
  document.getElementById(`draft-text-${i}`).style.display   = "block";
  document.getElementById(`draft-edit-${i}`).style.display   = "none";
  document.getElementById(`btn-edit-${i}`).style.display     = "inline-flex";
  document.getElementById(`btn-copy-${i}`).style.display     = "inline-flex";
  document.getElementById(`btn-save-${i}`).style.display     = "none";
  document.getElementById(`btn-discard-${i}`).style.display  = "none";
}

/* ── Copy to clipboard ────────────────────────────────────── */
async function copyDraft(i) {
  const text = state.drafts[i].text;
  const btn  = document.getElementById(`btn-copy-${i}`);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); document.execCommand("copy");
    document.body.removeChild(ta);
  }
  btn.textContent = "✓ " + t("copied");
  btn.classList.add("success");
  showToast(t("copied"));
  setTimeout(() => {
    btn.textContent = "📋 " + t("copyDraft");
    btn.classList.remove("success");
  }, 2500);
}

/* ── Google Review CTA ────────────────────────────────────── */
function renderGoogleBtn() {
  const url = CAFE_CONFIG.googleReviewUrl;
  const isPlaceholder = !url || url === "GOOGLE_REVIEW_URL_PLACEHOLDER";
  DOM.googleBtnLabel.textContent = t("openGoogleReview");
  if (isPlaceholder) {
    DOM.googleBtn.classList.add("url-missing");
    DOM.googleBtn.disabled = true;
    DOM.googleBtn.removeAttribute("href");
    DOM.urlMissingNote.textContent = t("googleUrlMissing");
    DOM.urlMissingNote.style.display = "block";
  } else {
    DOM.googleBtn.classList.remove("url-missing");
    DOM.googleBtn.disabled = false;
    DOM.googleBtn.href = url;
    DOM.urlMissingNote.style.display = "none";
  }
}

/* ── Toast ───────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg) {
  DOM.toast.textContent = msg;
  DOM.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => DOM.toast.classList.remove("show"), 2200);
}

/* ── Start over ──────────────────────────────────────────── */
function startOver() {
  state.stars         = 0;
  state.orderedItem   = "";
  state.serviceRating = "";
  state.standouts     = [];
  state.drafts        = [];
  DOM.orderInput.value = "";
  DOM.stars.forEach(btn => btn.classList.remove("selected"));
  updateRatingLabel();
  hideError(DOM.ratingError);
  hideError(DOM.orderError);
  renderServiceChips();
  renderStandoutChips();
  showStep(1);
}

/* ── Event bindings ──────────────────────────────────────── */
function bindEvents() {
  // Stars
  DOM.stars.forEach((btn, idx) => {
    btn.addEventListener("click",      () => setStars(idx + 1));
    btn.addEventListener("mouseenter", () => hoverStars(idx + 1));
    btn.addEventListener("mouseleave", resetStarHover);
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); setStars(idx + 1); }, { passive: false });
  });

  // Step 1 → 2
  DOM.nextStep1.addEventListener("click", () => { if (validateStep1()) showStep(2); });

  // Step 2 ← back
  DOM.backStep2.addEventListener("click", () => showStep(1));

  // Order input: clear error on type
  DOM.orderInput.addEventListener("input", () => {
    state.orderedItem = DOM.orderInput.value.trim();
    if (state.orderedItem) hideError(DOM.orderError);
  });

  // Generate
  DOM.generateBtn.addEventListener("click", () => {
    DOM.generateBtn.classList.add("loading");
    DOM.generateBtn.disabled = true;
    handleGenerate().finally(() => {
      DOM.generateBtn.classList.remove("loading");
      DOM.generateBtn.disabled = false;
    });
  });

  // Step 3 back
  const backStep3 = document.getElementById("back-step-3");
  if (backStep3) backStep3.addEventListener("click", () => showStep(2));

  // Start over
  DOM.startOverBtn.addEventListener("click", startOver);

  // Google button
  DOM.googleBtn.addEventListener("click", (e) => {
    if (!CAFE_CONFIG.googleReviewUrl || CAFE_CONFIG.googleReviewUrl === "GOOGLE_REVIEW_URL_PLACEHOLDER") {
      e.preventDefault();
      showToast("⚠ Google Review URL not yet configured");
    }
  });
}

/* ── Star hover helpers ──────────────────────────────────── */
function hoverStars(n)   { DOM.stars.forEach((b, i) => b.classList.toggle("hover", i < n)); }
function resetStarHover() { DOM.stars.forEach(b => b.classList.remove("hover")); }
