/**
 * main.js – EduScribe AI
 * Application controller. Orchestrates UI and API modules.
 * No direct DOM manipulation. No fetch calls.
 */

import { processVideo }                        from './api.js';
import { showLoader, hideLoader, displayNotes,
         showError, clearError,
         disableButton, enableButton }         from './ui.js';

/* ── Constants ────────────────────────────────────────────── */
const VIDEO_URL_INPUT_ID = 'videoUrl';

/* ── Helpers ──────────────────────────────────────────────── */

/**
 * Read and sanitise the video URL from the input field.
 * @returns {string}
 */
const getVideoUrl = () => {
  const input = document.getElementById(VIDEO_URL_INPUT_ID);
  return input ? input.value.trim() : '';
};

/**
 * Validate the provided URL string.
 * @param {string} url
 * @returns {{ valid: boolean, reason?: string }}
 */
const validateUrl = (url) => {
  if (!url) {
    return { valid: false, reason: 'Please paste a video URL before generating notes.' };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, reason: 'Only HTTP and HTTPS URLs are supported.' };
    }
  } catch {
    return { valid: false, reason: "That doesn't look like a valid URL. Please check and try again." };
  }

  return { valid: true };
};

/**
 * Extract the notes string from the API response object.
 * Supports common key names returned by different backend frameworks.
 * @param {Object} data
 * @returns {string}
 * @throws {Error} If no usable notes content is found.
 */
const extractNotes = (data) => {
  const notes =
    data?.notes      ??
    data?.content    ??
    data?.result     ??
    data?.transcript ??
    null;

  if (!notes || typeof notes !== 'string' || !notes.trim()) {
    throw new Error('The server returned an empty response. Please try again.');
  }

  return notes;
};

/* ── Core Handler ─────────────────────────────────────────── */

/**
 * Handle a "Generate Notes" button click.
 * Validates input, calls the API, and updates the UI accordingly.
 */
const handleGenerateNotes = async () => {
  const url = getVideoUrl();

  // ── Validate ──────────────────────────────────────────────
  const { valid, reason } = validateUrl(url);
  if (!valid) {
    showError(reason);
    document.getElementById(VIDEO_URL_INPUT_ID)?.focus();
    return;
  }

  // ── Start processing ──────────────────────────────────────
  clearError();
  disableButton();
  showLoader();

  try {
    const data  = await processVideo(url);
    const notes = extractNotes(data);
    displayNotes(notes);
  } catch (err) {
    showError(err?.message || 'An unexpected error occurred. Please try again.');
  } finally {
    hideLoader();
    enableButton();
  }
};

/* ── Initialisation ───────────────────────────────────────── */

/**
 * Bind all event listeners once the DOM is ready.
 */
const init = () => {
  const generateBtn = document.getElementById('generateBtn');
  const urlInput    = document.getElementById(VIDEO_URL_INPUT_ID);

  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerateNotes);
  }

  if (urlInput) {
    // Allow submitting with the Enter key from the input field
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleGenerateNotes();
    });

    // Clear stale error messages when the user edits the URL
    urlInput.addEventListener('input', clearError);
  }

  // Global keyboard shortcut: Cmd/Ctrl + Enter
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleGenerateNotes();
    }
  });
};

// Run after the DOM is fully parsed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}