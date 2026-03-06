/**
 * api.js – EduScribe AI
 * Responsible solely for backend communication.
 * No DOM access. No UI side-effects.
 */

const API_BASE_URL = 'http://localhost:8000';
const ENDPOINT     = `${API_BASE_URL}/process-video`;
const TIMEOUT_MS   = 90_000;

/**
 * Derive a user-friendly error message from a failed Response.
 * @param {Response} response
 * @returns {Promise<string>}
 */
const parseErrorResponse = async (response) => {
  try {
    const body = await response.json();
    return (
      body?.detail  ||
      body?.message ||
      body?.error   ||
      `Request failed with status ${response.status}.`
    );
  } catch {
    return response.statusText
      ? `${response.status}: ${response.statusText}`
      : `Request failed with status ${response.status}.`;
  }
};

/**
 * Send a video URL to the backend for processing and return the parsed JSON.
 *
 * @param {string} url - The lecture video URL to process.
 * @returns {Promise<Object>} Parsed JSON response from the server.
 * @throws {Error} Descriptive error for network failures, timeouts, or non-2xx responses.
 */
export const processVideo = async (url) => {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      },
      body:   JSON.stringify({ url }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const message = await parseErrorResponse(response);
      throw new Error(message);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new Error(
        'The request timed out. The video may be too long or the server is unreachable.'
      );
    }

    // Re-throw errors already constructed above (non-2xx, etc.)
    throw err;
  }
};