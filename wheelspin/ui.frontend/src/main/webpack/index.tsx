import React from 'react';
import ReactDOM from 'react-dom/client';
import { ScratchCard } from "@/components/ui/scratch-card";
import { PickAGift } from "@/components/ui/pick-a-gift";
import { SpinWheel } from "@/components/ui/spin-wheel";
import './index.css';

// Initialize Spin Wheel components
function initSpinWheel() {
  console.log('🔍 Searching for Spin Wheel components...');
  // Look for elements that contain the class name (AEM adds additional classes)
  const rootElements = document.querySelectorAll('[class*="spin-wheel-component"]');

  if (rootElements.length === 0) {
    console.warn('Spin Wheel: No root elements found');
    console.log('🔍 Available elements with similar classes:');
    document.querySelectorAll('[class*="spin"]').forEach(el => {
      console.log('  -', el.className, el.tagName);
    });
    return;
  }

  console.log(`Found ${rootElements.length} Spin Wheel component(s) to initialize`);

  rootElements.forEach((rootElement, index) => {
    try {
      const container = rootElement.querySelector('.spin-wheel-container');
      if (!container) {
        console.error(`No container found for Spin Wheel component ${index + 1}`);
        console.log('Available child elements:', rootElement.children);
        return;
      }

      // Hide loading state
      const loadingElement = rootElement.querySelector('.spin-wheel-loading') as HTMLElement;
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }

      const root = ReactDOM.createRoot(container);

      // Get configuration from data attributes
      const wheelSize = parseInt(rootElement.getAttribute('data-wheel-size') || '500');
      const animationDuration = parseInt(rootElement.getAttribute('data-animation-duration') || '4000');
      const minRevolutions = parseInt(rootElement.getAttribute('data-min-revolutions') || '5');
      const maxRevolutions = parseInt(rootElement.getAttribute('data-max-revolutions') || '8');
      const hasSegments = rootElement.getAttribute('data-has-segments') === 'true';
      const title = rootElement.getAttribute('data-title') || 'Spin the Wheel!';
      const buttonText = rootElement.getAttribute('data-button-text') || 'SPIN';
      const spinningText = rootElement.getAttribute('data-spinning-text') || 'Spinning...';
      const variant = rootElement.getAttribute('data-variant') || 'card';
      const size = rootElement.getAttribute('data-size') || 'lg';

      // Use default segments (will be enhanced to fetch from AEM)
      const segments = [
        { text: "10% Off", color: "#FFC300" },
        { text: "Free Shipping", color: "#FF5733" },
        { text: "Buy One Get One", color: "#C70039" },
        { text: "20% Off", color: "#900C3F" },
        { text: "No Luck", color: "#581845" },
        { text: "Gift Card", color: "#2E86C1" }
      ];

      // If AEM has configured segments, fetch them from the servlet
      if (hasSegments) {
        console.log('Dynamic segments detected in AEM configuration');
        // For now, use default segments. Dynamic fetching can be implemented later
        console.log('Using default segments for now');
      }

      // Render the component
      root.render(
        React.createElement(SpinWheel, {
          segments: segments,
          wheelSize: wheelSize,
          animationDuration: animationDuration,
          minRevolutions: minRevolutions,
          maxRevolutions: maxRevolutions,
          title: title,
          buttonText: buttonText,
          spinningText: spinningText,
          variant: variant as "card" | "default" | "minimal",
          size: size as "lg" | "default" | "sm" | "xl",
          onSpinStart: () => {
            console.log(`Spin Wheel ${index + 1} started spinning`);
          },
          onSpinEnd: (result) => {
            console.log(`Spin Wheel ${index + 1} result:`, result);

            // Dispatch custom event for analytics
            const customEvent = new CustomEvent('spin-wheel-result', {
              detail: {
                componentIndex: index,
                result: result,
                timestamp: new Date().toISOString()
              }
            });
            rootElement.dispatchEvent(customEvent);
          }
        })
      );

      console.log(`Spin Wheel component ${index + 1} initialized successfully with ${segments.length} segments`);
    } catch (error) {
      console.error(`Error initializing Spin Wheel component ${index + 1}:`, error);
    }
  });
}

// Initialize Scratch Card components
function initScratchCard() {
  console.log('🔍 Searching for Scratch Card components...');
  // Look for elements that contain the class name (AEM adds additional classes)
  const rootElements = document.querySelectorAll('[class*="scratch-card-component"]');

  if (rootElements.length === 0) {
    console.warn('Scratch Card: No root elements found');
    console.log('🔍 Available elements with similar classes:');
    document.querySelectorAll('[class*="scratch"]').forEach(el => {
      console.log('  -', el.className, el.tagName);
    });
    return;
  }

  console.log(`Found ${rootElements.length} Scratch Card component(s) to initialize`);

  rootElements.forEach((rootElement, index) => {
    try {
      const container = rootElement.querySelector('.scratch-card-container');
      if (!container) {
        console.error(`No container found for Scratch Card component ${index + 1}`);
        console.log('Available child elements:', rootElement.children);
        return;
      }

      // Hide loading state
      const loadingElement = rootElement.querySelector('.scratch-card-loading') as HTMLElement;
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }

      const root = ReactDOM.createRoot(container);

      const renderScratchCard = () => {
        // Get configuration from data attributes
        const prizesData = rootElement.getAttribute('data-prizes');
        const title = rootElement.getAttribute('data-title') || 'Scratch to Win!';
        const instructions = rootElement.getAttribute('data-instructions') || 'Scratch the surface to reveal your prize!';
        const cardWidth = parseInt(rootElement.getAttribute('data-card-width') || '300');
        const cardHeight = parseInt(rootElement.getAttribute('data-card-height') || '200');
        const brushRadius = parseInt(rootElement.getAttribute('data-brush-radius') || '20');
        const scratchColor = rootElement.getAttribute('data-scratch-color') || '#c0c0c0';
        const scratchPattern = rootElement.getAttribute('data-scratch-pattern') || 'Scratch Here!';
        const revealThreshold = parseInt(rootElement.getAttribute('data-reveal-threshold') || '60');
        const resetButtonText = rootElement.getAttribute('data-reset-button-text') || 'Try Again';

        // Parse prizes
        let prizes = [];
        try {
          prizes = prizesData ? JSON.parse(prizesData) : [
            { text: "25% Discount", value: "Code: SCRATCH25", color: "#4CAF50", icon: "🎯" }
          ];
        } catch (e) {
          console.error('Error parsing prizes data for Scratch Card:', e);
          prizes = [
            { text: "25% Discount", value: "Code: SCRATCH25", color: "#4CAF50", icon: "🎯" }
          ];
        }

        const selectedPrize = prizes[Math.floor(Math.random() * prizes.length)];

        root.render(
          React.createElement(ScratchCard, {
            prizes: [selectedPrize],
            title: title,
            instructions: instructions,
            cardWidth: cardWidth,
            cardHeight: cardHeight,
            brushRadius: brushRadius,
            scratchColor: scratchColor,
            scratchPattern: scratchPattern,
            revealThreshold: revealThreshold,
            resetButtonText: resetButtonText,
            onScratchStart: () => {
              console.log(`Scratch Card ${index + 1} started scratching`);
            },
            onReveal: (prize) => {
              console.log(`Scratch Card ${index + 1} revealed:`, prize);

              // Dispatch custom event for analytics
              const customEvent = new CustomEvent('scratch-card-reveal', {
                detail: {
                  componentIndex: index,
                  prize: prize,
                  timestamp: new Date().toISOString()
                }
              });
              rootElement.dispatchEvent(customEvent);
            }
          })
        );

        console.log(`Scratch Card component ${index + 1} initialized successfully`);
      };

      renderScratchCard();
    } catch (error) {
      console.error(`Error initializing Scratch Card component ${index + 1}:`, error);
    }
  });
}

// Initialize Pick-a-Gift components
function initPickGift() {
  console.log('🔍 Searching for Pick-a-Gift components...');
  // Look for elements that contain the class name (AEM adds additional classes)
  const rootElements = document.querySelectorAll('[class*="pick-gift-component"]');

  if (rootElements.length === 0) {
    console.warn('Pick-a-Gift: No root elements found');
    console.log('🔍 Available elements with similar classes:');
    document.querySelectorAll('[class*="pick"]').forEach(el => {
      console.log('  -', el.className, el.tagName);
    });
    return;
  }

  console.log(`Found ${rootElements.length} Pick-a-Gift component(s) to initialize`);

  rootElements.forEach((rootElement, index) => {
    try {
      const container = rootElement.querySelector('.pick-gift-container');
      if (!container) {
        console.error(`No container found for Pick-a-Gift component ${index + 1}`);
        console.log('Available child elements:', rootElement.children);
        return;
      }

      // Hide loading state
      const loadingElement = rootElement.querySelector('.pick-gift-loading') as HTMLElement;
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }

      const root = ReactDOM.createRoot(container);

      const renderPickAGift = () => {
        // Get configuration from data attributes
        const prizesData = rootElement.getAttribute('data-prizes');
        const title = rootElement.getAttribute('data-title') || 'Pick a gift!';
        const subtitle = rootElement.getAttribute('data-subtitle') || 'Pick one of the gift boxes to reveal your prize';
        const autoOpen = rootElement.getAttribute('data-auto-open') === 'true';
        const showCloseButton = rootElement.getAttribute('data-show-close-button') === 'true';
        const animationDuration = parseInt(rootElement.getAttribute('data-animation-duration') || '1000');
        const variant = rootElement.getAttribute('data-variant') || 'default';
        const size = rootElement.getAttribute('data-size') || 'default';

        // Parse prizes
        let prizes = [];
        try {
          prizes = prizesData ? JSON.parse(prizesData) : [
            { text: "30% OFF", value: "Use code: GIFT30", color: "#e74c3c", icon: "🎯" },
            { text: "Free Shipping", value: "On orders over $25", color: "#3498db", icon: "🚚" },
            { text: "$15 Gift Card", value: "Valid for 60 days", color: "#27ae60", icon: "💳" },
            { text: "Buy 1 Get 1 Free", value: "Select items only", color: "#f39c12", icon: "🎁" },
            { text: "Try Again!", value: "Better luck next time", color: "#95a5a6", icon: "🔄" }
          ];
        } catch (e) {
          console.error('Error parsing prizes data for Pick-a-Gift:', e);
          prizes = [
            { text: "30% OFF", value: "Use code: GIFT30", color: "#e74c3c", icon: "🎯" },
            { text: "Free Shipping", value: "On orders over $25", color: "#3498db", icon: "🚚" },
            { text: "$15 Gift Card", value: "Valid for 60 days", color: "#27ae60", icon: "💳" },
            { text: "Buy 1 Get 1 Free", value: "Select items only", color: "#f39c12", icon: "🎁" },
            { text: "Try Again!", value: "Better luck next time", color: "#95a5a6", icon: "🔄" }
          ];
        }

        root.render(
          React.createElement(PickAGift, {
            prizes: prizes,
            title: title,
            subtitle: subtitle,
            autoOpen: autoOpen,
            showCloseButton: showCloseButton,
            animationDuration: animationDuration,
            size: size as "lg" | "default" | "sm" | "xl",
            onReveal: (result) => {
              console.log(`Pick-a-Gift ${index + 1} - Prize won:`, result);

              // Dispatch custom event for analytics
              const customEvent = new CustomEvent('pick-gift-result', {
                detail: {
                  componentIndex: index,
                  result: result,
                  timestamp: new Date().toISOString()
                }
              });
              rootElement.dispatchEvent(customEvent);
            }
          })
        );

        console.log(`Pick-a-Gift component ${index + 1} initialized successfully`);
      };

      renderPickAGift();
    } catch (error) {
      console.error(`Error initializing Pick-a-Gift component ${index + 1}:`, error);
    }
  });
}

// Export initialization functions to global window object
declare global {
  interface Window {
    initSpinWheel: () => void;
    initScratchCard: () => void;
    initPickGift: () => void;
  }
}

window.initSpinWheel = initSpinWheel;
window.initScratchCard = initScratchCard;
window.initPickGift = initPickGift;

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing all gamification components...');
  
  // Initialize all components
  initSpinWheel();
  initScratchCard();
  initPickGift();
});

// Also try initialization with retry logic for AEM's asynchronous rendering
function initializeWithRetry() {
  console.log('🔄 Attempting to initialize components with retry logic...');
  
  // Try immediately
  initSpinWheel();
  initScratchCard();
  initPickGift();
  
  // Try again after a short delay
  setTimeout(() => {
    console.log('🔄 Retry 1: Checking for components again...');
    initSpinWheel();
    initScratchCard();
    initPickGift();
  }, 1000);
  
  // Try again after a longer delay
  setTimeout(() => {
    console.log('🔄 Retry 2: Final attempt to find components...');
    initSpinWheel();
    initScratchCard();
    initPickGift();
  }, 3000);
}

// Start retry logic
initializeWithRetry();

console.log('Gamification components initialization script loaded'); 