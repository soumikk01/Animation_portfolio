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
  TOOLTIP_DISPLAY_DURATION: 5,
  NAVBAR_SCROLL_THRESHOLD: 100,
  
  // Loading (in milliseconds)
  INITIAL_LOAD_TIME: 1500,
  
  // Easing functions
  POWER4_OUT: 'power4.out',
  EXPO_IN_OUT: 'expo.inOut',
  POWER3_OUT: 'power3.out',
  BACK_OUT: 'back.out(1.5)',
  ELASTIC_OUT: 'elastic.out(1, 0.5)',
};

export const VALIDATION_LIMITS = {
  MAX_MESSAGE_LENGTH: 500,

};
