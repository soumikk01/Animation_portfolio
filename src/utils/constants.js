// Animation timing constants
// Centralized timing values for consistency across the application

export const ANIMATION_TIMINGS = {
  // Duration values (in seconds)
  HERO_TEXT_ENTRANCE: 1.2,
  ANNOTATION_LINE: 0.8,
  ANNOTATION_TEXT: 0.8,
  FADE_IN_DEFAULT: 0.8,
  STAGGER_FADE_DEFAULT: 0.7,
  TEXT_REVEAL_DEFAULT: 1.0,
  
  // Stagger delays (in seconds)
  HERO_TEXT_STAGGER: 0.3,
  ANNOTATION_LINE_STAGGER: 0.1,
  ANNOTATION_TEXT_STAGGER: 0.1,
  FADE_IN_STAGGER: 0.2,
  TECH_ITEM_STAGGER: 0.04,
  PROJECT_ITEM_STAGGER: 0.2,
  
  // Other delays (in seconds)
  HERO_ENTRANCE_DELAY: 2.2,
  TYPING_ANIMATION_DELAY: 3.4,
  TOOLTIP_DISPLAY_DURATION: 5, // 5 seconds
  NAVBAR_SCROLL_THRESHOLD: 100, // pixels
  
  // Loading (in milliseconds)
  INITIAL_LOAD_TIME: 1500,
  
  // Easing functions (for reference)
  POWER4_OUT: 'power4.out',
  EXPO_IN_OUT: 'expo.inOut',
  POWER3_OUT: 'power3.out',
  BACK_OUT: 'back.out(1.5)',
  ELASTIC_OUT: 'elastic.out(1, 0.5)',
};

export const PERFORMANCE_SETTINGS = {
  // Mobile detection breakpoint (in pixels)
  MOBILE_BREAKPOINT: 768,
  
  // Bubble counts
  DESKTOP_BUBBLES: 12,
  MOBILE_BUBBLES: 6,
  
  DESKTOP_DECORATIVE_BUBBLES: 15,
  MOBILE_DECORATIVE_BUBBLES: 8,
  
  DESKTOP_BLASTING_BUBBLES: 10,
  MOBILE_BLASTING_BUBBLES: 6,
  
  // Quality settings
  DESKTOP_SAMPLES: 4,
  MOBILE_SAMPLES: 1,
  
  DESKTOP_RESOLUTION: 512,
  MOBILE_RESOLUTION: 256,
};

export const VALIDATION_LIMITS = {
  // Chat input validation
  MAX_MESSAGE_LENGTH: 500,
  SOUND_COOLDOWN_MS: 150,
};

// Comment: These timing values are carefully tuned for visual appeal
// and user experience. Modifying them may affect animation quality.
// Test thoroughly before changing production values.
