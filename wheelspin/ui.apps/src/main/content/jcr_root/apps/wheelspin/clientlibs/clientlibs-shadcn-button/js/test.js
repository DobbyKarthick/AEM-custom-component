// Simple test script
console.log("Shadcn Button Test Script Loaded!");

window.initShadcnButton = function () {
  console.log("initShadcnButton function called");

  // Find all shadcn button components
  const components = document.querySelectorAll(".shadcn-button-component");
  console.log("Found components:", components.length);

  components.forEach((component, index) => {
    const container = component.querySelector(".shadcn-button-container");
    if (container) {
      container.innerHTML = `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Test Button ${
        index + 1
      }</button>`;
      console.log("Initialized test button", index + 1);
    }
  });
};

// Auto-initialize on DOM ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM ready, initializing shadcn buttons...");
  if (window.initShadcnButton) {
    window.initShadcnButton();
  }
});
