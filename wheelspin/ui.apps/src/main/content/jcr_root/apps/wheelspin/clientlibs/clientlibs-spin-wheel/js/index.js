import React from "react";
import ReactDOM from "react-dom/client";
import { SpinWheel } from "./components/ui/spin-wheel.tsx";

// Function to get component properties from data attributes
function getComponentConfig(rootElement) {
  const dataset = rootElement.dataset;

  // Parse segments from JSON string
  let segments;
  try {
    segments = JSON.parse(dataset.segments || "[]");
  } catch (e) {
    console.error("Error parsing segments:", e);
    segments = [
      { text: "10% Off", color: "#FFC300" },
      { text: "Free Shipping", color: "#FF5733" },
      { text: "Buy One Get One", color: "#C70039" },
      { text: "20% Off", color: "#900C3F" },
      { text: "No Luck", color: "#581845" },
      { text: "Gift Card", color: "#2E86C1" },
    ];
  }

  return {
    segments: segments,
    wheelSize: parseInt(dataset.wheelSize) || 500,
    animationDuration: parseInt(dataset.animationDuration) || 4000,
    minRevolutions: parseInt(dataset.minRevolutions) || 5,
    maxRevolutions: parseInt(dataset.maxRevolutions) || 8,
    title: dataset.title || "Spin the Wheel!",
    buttonText: dataset.buttonText || "SPIN",
    spinningText: dataset.spinningText || "Spinning...",
    variant: dataset.variant || "card",
    size: dataset.size || "lg",
  };
}

// Initialize spin wheel components with retry logic
function initSpinWheel() {
  // Find all spin wheel components on the page
  const rootElements = document.querySelectorAll(".spin-wheel-component");

  if (rootElements.length === 0) {
    console.warn("Shadcn Spin Wheel: No root elements found, will retry in 1 second...");
    // Retry after 1 second in case components are still loading
    setTimeout(initSpinWheel, 1000);
    return;
  }

  console.log(
    `Found ${rootElements.length} Shadcn Spin Wheel component(s) to initialize`
  );

  rootElements.forEach((rootElement, index) => {
    try {
      // Get configuration from data attributes
      const config = getComponentConfig(rootElement);
      console.log(`Shadcn SpinWheel ${index + 1} config:`, config);

      // Find the container where React should render
      const container = rootElement.querySelector(".spin-wheel-container");
      if (!container) {
        console.error(`No container found for component ${index + 1}`);
        return;
      }

      // Hide loading state
      const loadingElement = rootElement.querySelector(".spin-wheel-loading");
      if (loadingElement) {
        loadingElement.style.display = "none";
      }

      // Create React root and render the shadcn component
      const root = ReactDOM.createRoot(container);
      root.render(
        React.createElement(SpinWheel, {
          ...config,
          onSpinStart: () => {
            console.log(`Shadcn SpinWheel ${index + 1} started spinning`);
          },
          onSpinEnd: (result) => {
            console.log(
              `Shadcn SpinWheel ${index + 1} stopped. Result:`,
              result
            );
          },
        })
      );

      console.log(
        `Shadcn Spin Wheel component ${index + 1} initialized successfully`,
        config
      );
    } catch (error) {
      console.error(
        `Error initializing Shadcn Spin Wheel component ${index + 1}:`,
        error
      );

      // Show fallback content on error
      const noscript = rootElement.querySelector("noscript");
      if (noscript) {
        const fallbackContent = noscript.innerHTML;
        rootElement.innerHTML = fallbackContent;
      }
    }
  });
}

// Make the initialization function globally available
window.initSpinWheel = initSpinWheel;

// Initialize with multiple attempts to handle AEM's asynchronous rendering
function initializeWithRetry() {
  // Try immediately
  initSpinWheel();
  
  // Also try after DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSpinWheel);
  }
  
  // Try again after a short delay to catch any late-rendered components
  setTimeout(initSpinWheel, 100);
  
  // Try again after a longer delay for any very slow components
  setTimeout(initSpinWheel, 2000);
  
  // Try one more time after 5 seconds for any extremely slow components
  setTimeout(initSpinWheel, 5000);
}

// Start initialization
initializeWithRetry();
