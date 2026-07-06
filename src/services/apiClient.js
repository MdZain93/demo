/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simulated Axios-like api client for frontend-only environment.
// It handles simulated latency, token injection, and response interceptors.

export const simulateDelay = (ms = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const apiClient = {
  get: async (url) => {
    await simulateDelay();
    console.log(`[API MOCK] GET Request to: ${url}`);
    return { data: null };
  },
  post: async (url, data) => {
    await simulateDelay();
    console.log(`[API MOCK] POST Request to: ${url}`, data);
    return { data };
  },
  put: async (url, data) => {
    await simulateDelay();
    console.log(`[API MOCK] PUT Request to: ${url}`, data);
    return { data };
  },
  delete: async (url) => {
    await simulateDelay();
    console.log(`[API MOCK] DELETE Request to: ${url}`);
    return { data: { success: true } };
  }
};

export default apiClient;
