// API Configuration
// Move hardcoded API endpoints here for maintainability

export const API_CONFIG = {
  GEMINI: {
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
    MODEL: 'gemini-2.5-flash',
    DEFAULT_PARAMS: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  },
};

// Helper function to get the API endpoint
export const getGeminiEndpoint = (apiKey) => {
  return `${API_CONFIG.GEMINI.BASE_URL}/models/${API_CONFIG.GEMINI.MODEL}:generateContent?key=${apiKey}`;
};
