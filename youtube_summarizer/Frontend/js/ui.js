/**
 * ui.js – EduScribe AI
 * Responsible solely for DOM manipulation.
 * No fetch calls. No business logic.
 */

/* ── Element References ───────────────────────────────────── */
const getEl = (id) => document.getElementById(id);

const els = {
  generateBtn:   () => getEl('generateBtn'),
  loader:        () => getEl('loader'),
  notesContainer:() => getEl('notesContainer'),
  errorMessage:  () => getEl('errorMessage'),
};

/* ── Helpers ──────────────────────────────────────────────── */

/**
 * Escape a string for safe insertion as HTML text content.
 * @param {string} str
 * @returns {string}
 */
const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/**
 * Detect whether a string contains HTML markup.
 * @param {string} str
 * @returns {boolean}
 */
const isHtml = (str) => /<[a-z][\s\S]*>/i.test(str);

/**
 * Convert plain text to a sequence of HTML paragraph elements.
 * @param {string} text
 * @returns {string}
 */
const plainTextToHtml = (text) =>
  text
    .split(/\n{2,}/)
    .filter((block) => block.trim())
    .map((block) => `<p>${escapeHtml(block.trim())}</p>`)
    .join('');

/* ── Exported UI Functions ────────────────────────────────── */

/**
 * Show the loading indicator.
 */
export const showLoader = () => {
  const loader = els.loader();
  if (!loader) return;
  loader.style.display    = '';
  loader.removeAttribute('hidden');
  loader.setAttribute('aria-busy', 'true');
};

/**
 * Hide the loading indicator.
 */
export const hideLoader = () => {
  const loader = els.loader();
  if (!loader) return;
  loader.style.display = 'none';
  loader.setAttribute('hidden', '');
  loader.removeAttribute('aria-busy');
};

/**
 * Render the generated notes inside the notes container.
 * Accepts either an HTML string or plain text.
 * @param {string} notes
 */
export const displayNotes = (notes) => {
  const container = els.notesContainer();
  if (!container) return;

  clearError();

  const content = isHtml(notes) ? notes : plainTextToHtml(notes);
  container.innerHTML = content;
  container.removeAttribute('hidden');
  container.setAttribute('aria-live', 'polite');

  // Scroll to the top of the notes area
  container.scrollTop = 0;
};

/**
 * Display an error message to the user.
 * @param {string} message
 */
export const showError = (message) => {
  const errorEl = els.errorMessage();
  if (!errorEl) return;

  errorEl.textContent = message;
  errorEl.removeAttribute('hidden');
  errorEl.style.display = '';
  errorEl.setAttribute('role', 'alert');
};

/**
 * Clear any currently displayed error message.
 */
export const clearError = () => {
  const errorEl = els.errorMessage();
  if (!errorEl) return;

  errorEl.textContent = '';
  errorEl.setAttribute('hidden', '');
  errorEl.style.display = 'none';
  errorEl.removeAttribute('role');
};

/**
 * Disable the Generate Notes button to prevent duplicate submissions.
 */
export const disableButton = () => {
  const btn = els.generateBtn();
  if (!btn) return;
  btn.disabled = true;
  btn.setAttribute('aria-disabled', 'true');
};

/**
 * Re-enable the Generate Notes button.
 */
export const enableButton = () => {
  const btn = els.generateBtn();
  if (!btn) return;
  btn.disabled = false;
  btn.removeAttribute('aria-disabled');
};