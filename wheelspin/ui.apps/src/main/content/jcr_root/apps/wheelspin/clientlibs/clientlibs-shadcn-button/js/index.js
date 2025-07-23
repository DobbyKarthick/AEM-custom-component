import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// Function to get component properties from data attributes
function getComponentProps(rootElement) {
  const dataset = rootElement.dataset;

  return {
    text: dataset.text || "Click me",
    variant: dataset.variant || "default",
    size: dataset.size || "default",
    linkUrl: dataset.linkUrl || "",
    openInNewTab: dataset.openInNewTab === "true",
    disabled: dataset.disabled === "true",
    ariaLabel: dataset.ariaLabel || "",
    ariaDescribedBy: dataset.ariaDescribedBy || "",
    role: dataset.role || "button",
    className: dataset.cssClasses || "",
    // New spinner-related props
    showSpinner: dataset.showSpinner === "true",
    spinnerDuration: parseInt(dataset.spinnerDuration) || 2000,
    loadingText: dataset.loadingText || "Loading...",
  };
}

// Function to handle button clicks with spinner
function handleButtonClick(props, setLoading) {
  return function (event) {
    const { linkUrl, openInNewTab, showSpinner, spinnerDuration } = props;

    // Show spinner if enabled
    if (showSpinner) {
      setLoading(true);

      // Hide spinner after specified duration
      setTimeout(() => {
        setLoading(false);
      }, spinnerDuration);
    }

    // Handle navigation after a small delay if spinner is shown
    const navigationDelay = showSpinner ? 100 : 0;

    setTimeout(() => {
      if (linkUrl) {
        if (openInNewTab) {
          window.open(linkUrl, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = linkUrl;
        }
      }
    }, navigationDelay);

    // Dispatch custom event for analytics or other tracking
    const customEvent = new CustomEvent("shadcn-button-click", {
      detail: {
        variant: props.variant,
        size: props.size,
        text: props.text,
        linkUrl: props.linkUrl,
        showSpinner: props.showSpinner,
      },
    });
    event.target.dispatchEvent(customEvent);
  };
}

// React component that renders the button with dynamic props and spinner
function ShadcnButtonComponent({ props }) {
  const [loading, setLoading] = useState(false);

  const buttonProps = {
    variant: props.variant,
    size: props.size,
    disabled: props.disabled || loading,
    className: props.className,
    onClick: handleButtonClick(props, setLoading),
    "aria-label": props.ariaLabel || undefined,
    "aria-describedby": props.ariaDescribedBy || undefined,
    role: props.role,
  };

  // Determine spinner size based on button size
  const spinnerSize =
    props.size === "lg" ? "md" : props.size === "sm" ? "sm" : "sm";

  // Button content with spinner
  const buttonContent = loading ? (
    <div className="flex items-center gap-2">
      <Spinner size={spinnerSize} className="mr-2" />
      {props.loadingText}
    </div>
  ) : (
    props.text
  );

  // If it's a link variant or has a linkUrl, render as a link
  if (props.variant === "link" || props.linkUrl) {
    buttonProps.asChild = true;
    return (
      <Button {...buttonProps}>
        <a
          href={props.linkUrl || "#"}
          target={props.openInNewTab ? "_blank" : undefined}
          rel={props.openInNewTab ? "noopener noreferrer" : undefined}
          aria-label={props.ariaLabel || undefined}
          aria-describedby={props.ariaDescribedBy || undefined}
        >
          {buttonContent}
        </a>
      </Button>
    );
  }

  return <Button {...buttonProps}>{buttonContent}</Button>;
}

// Function to initialize a single button component
function initializeSingleButton(rootElement, index) {
  // Hide loading placeholder
  const loadingPlaceholder = rootElement.querySelector(".loading-placeholder");
  if (loadingPlaceholder) {
    loadingPlaceholder.style.display = "none";
  }

  try {
    const props = getComponentProps(rootElement);

    // Create React root and render component
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ShadcnButtonComponent props={props} />
      </React.StrictMode>
    );

    console.log(
      `Shadcn Button component ${index + 1} initialized successfully`,
      props
    );
  } catch (error) {
    console.error(
      `Error initializing Shadcn Button component ${index + 1}:`,
      error
    );

    // Show fallback content on error
    const noscript = rootElement.querySelector("noscript");
    if (noscript) {
      const fallbackContent = noscript.innerHTML;
      rootElement.innerHTML = fallbackContent;
    }
  }
}

// Main initialization function - handles multiple instances
function initShadcnButton() {
  // Find all shadcn button components on the page
  const rootElements = document.querySelectorAll(".shadcn-button-component");

  if (rootElements.length === 0) {
    console.warn("Shadcn Button: No root elements found");
    return;
  }

  console.log(
    `Found ${rootElements.length} Shadcn Button component(s) to initialize`
  );

  // Initialize each component
  rootElements.forEach((rootElement, index) => {
    // Assign unique ID if not present
    if (!rootElement.id) {
      rootElement.id = `shadcn-button-root-${index + 1}`;
    }

    initializeSingleButton(rootElement, index);
  });
}

// Make the initialization function globally available
window.initShadcnButton = initShadcnButton;

// Initialize immediately if DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShadcnButton);
} else {
  // Use setTimeout to ensure all components are rendered
  setTimeout(initShadcnButton, 100);
}
