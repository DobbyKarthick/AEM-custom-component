/*
 * Pick-a-Gift Bundle with UMD wrapper
 * This bundle properly exposes the initPickGift function globally
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["pick-gift"] = factory();
  else root["pick-gift"] = factory();
})(this, () => {
  // Import React and ReactDOM from global scope (assuming they're loaded)
  const React = window.React;
  const ReactDOM = window.ReactDOM;

  // Utility function from shadcn
  function cn(...inputs) {
    return inputs.filter(Boolean).join(" ");
  }

  // Basic cva implementation
  function cva(base, config) {
    return (props) => {
      if (!config?.variants) return cn(base, props?.class, props?.className);

      const { variants, defaultVariants } = config;
      const getVariantClassNames = Object.keys(variants).map((variant) => {
        const variantProp = props?.[variant];
        const defaultVariantProp = defaultVariants?.[variant];
        if (variantProp === null) return null;
        const variantKey = String(variantProp || defaultVariantProp || "");
        return variants[variant][variantKey];
      });

      return cn(base, ...getVariantClassNames, props?.class, props?.className);
    };
  }

  // Button component
  const Button = ({
    className,
    variant = "default",
    size = "default",
    children,
    ...props
  }) => {
    const buttonClasses = cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-primary text-primary-foreground shadow hover:bg-primary/90":
          variant === "default",
        "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90":
          variant === "destructive",
        "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground":
          variant === "outline",
        "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80":
          variant === "secondary",
        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
        "text-primary underline-offset-4 hover:underline": variant === "link",
      },
      {
        "h-9 px-4 py-2": size === "default",
        "h-8 rounded-md px-3": size === "sm",
        "h-10 rounded-md px-8": size === "lg",
        "h-9 w-9": size === "icon",
      },
      className
    );

    return React.createElement(
      "button",
      { className: buttonClasses, ...props },
      children
    );
  };

  // Gift Box Icon Component
  const GiftBoxIcon = ({ className, ...props }) => {
    return React.createElement(
      "svg",
      {
        className: className,
        viewBox: "0 0 100 100",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        ...props,
      },
      [
        // Gift box body
        React.createElement("rect", {
          key: "box-body",
          x: "15",
          y: "40",
          width: "70",
          height: "45",
          fill: "#DC2626",
          stroke: "#B91C1C",
          strokeWidth: "2",
          rx: "2",
        }),
        // Gift box top
        React.createElement("rect", {
          key: "box-top",
          x: "10",
          y: "35",
          width: "80",
          height: "10",
          fill: "#B91C1C",
          stroke: "#991B1B",
          strokeWidth: "2",
          rx: "2",
        }),
        // Vertical ribbon
        React.createElement("rect", {
          key: "ribbon-vertical",
          x: "45",
          y: "20",
          width: "10",
          height: "65",
          fill: "#F9A8D4",
          stroke: "#F472B6",
          strokeWidth: "1",
        }),
        // Horizontal ribbon
        React.createElement("rect", {
          key: "ribbon-horizontal",
          x: "10",
          y: "45",
          width: "80",
          height: "10",
          fill: "#F9A8D4",
          stroke: "#F472B6",
          strokeWidth: "1",
        }),
        // Bow left
        React.createElement("ellipse", {
          key: "bow-left",
          cx: "40",
          cy: "25",
          rx: "8",
          ry: "6",
          fill: "#F472B6",
          stroke: "#EC4899",
          strokeWidth: "1",
        }),
        // Bow right
        React.createElement("ellipse", {
          key: "bow-right",
          cx: "60",
          cy: "25",
          rx: "8",
          ry: "6",
          fill: "#F472B6",
          stroke: "#EC4899",
          strokeWidth: "1",
        }),
        // Bow center
        React.createElement("ellipse", {
          key: "bow-center",
          cx: "50",
          cy: "25",
          rx: "3",
          ry: "4",
          fill: "#EC4899",
          stroke: "#DB2777",
          strokeWidth: "1",
        }),
      ]
    );
  };

  // Pick Gift Component
  const PickGift = React.forwardRef((props, ref) => {
    const {
      className,
      title = "Pick a gift for a chance to win a prize for your next order!",
      subtitle,
      gifts = [
        { prize: "10% Off", probability: 0.3, type: "discount" },
        { prize: "Free Shipping", probability: 0.2, type: "shipping" },
        { prize: "$5 Gift Card", probability: 0.15, type: "giftcard" },
        { prize: "20% Off", probability: 0.1, type: "discount" },
        { prize: "Free Sample", probability: 0.2, type: "sample" },
        { prize: "Try Again", probability: 0.05, type: "none" },
      ],
      numberOfGifts = 3,
      autoOpen = false,
      showCloseButton = true,
      winMessage = "Congratulations! You won: {prize}",
      noWinMessage = "Better luck next time!",
      variant = "default",
      size = "default",
      animationDuration = 1000,
      onGiftPicked,
      onClose,
      ...restProps
    } = props;

    const [isOpen, setIsOpen] = React.useState(autoOpen);
    const [selectedGift, setSelectedGift] = React.useState(null);
    const [gameResult, setGameResult] = React.useState(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [showResult, setShowResult] = React.useState(false);
    const [gameDisabled, setGameDisabled] = React.useState(false);

    // Auto-open effect
    React.useEffect(() => {
      if (autoOpen) {
        setIsOpen(true);
      }
    }, [autoOpen]);

    // Gift selection algorithm
    const selectPrize = React.useCallback(() => {
      const random = Math.random();
      let cumulativeProbability = 0;

      for (let i = 0; i < gifts.length; i++) {
        cumulativeProbability += gifts[i].probability;
        if (random <= cumulativeProbability) {
          return gifts[i];
        }
      }

      // Fallback to last gift if probabilities don't sum to 1
      return gifts[gifts.length - 1];
    }, [gifts]);

    // Handle gift box click
    const handleGiftClick = React.useCallback(
      (giftIndex) => {
        if (gameDisabled || isAnimating || selectedGift !== null) return;

        setIsAnimating(true);
        setSelectedGift(giftIndex);
        setGameDisabled(true);

        // Simulate gift opening animation
        setTimeout(() => {
          const prize = selectPrize();
          setGameResult(prize);
          setIsAnimating(false);

          // Show result after animation
          setTimeout(() => {
            setShowResult(true);
            onGiftPicked?.(prize);
          }, 200);
        }, animationDuration);
      },
      [
        gameDisabled,
        isAnimating,
        selectedGift,
        selectPrize,
        animationDuration,
        onGiftPicked,
      ]
    );

    // Handle close
    const handleClose = React.useCallback(() => {
      setIsOpen(false);
      onClose?.();
    }, [onClose]);

    // Reset game
    const resetGame = React.useCallback(() => {
      setSelectedGift(null);
      setGameResult(null);
      setIsAnimating(false);
      setShowResult(false);
      setGameDisabled(false);
    }, []);

    // Handle result close
    const handleResultClose = React.useCallback(() => {
      setShowResult(false);
      resetGame();
    }, [resetGame]);

    // Generate gift boxes based on numberOfGifts
    const giftBoxes = Array.from(
      { length: numberOfGifts },
      (_, index) => index
    );

    // Modal classes
    const modalClasses = cn(
      "pick-gift-modal",
      `pick-gift-variant-${variant}`,
      `pick-gift-size-${size}`,
      className
    );

    if (!isOpen) return null;

    return React.createElement(
      "div",
      {
        className: "pick-gift-modal-overlay",
        onClick: (e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        },
      },
      [
        React.createElement(
          "div",
          {
            key: "modal",
            className: modalClasses,
            ref: ref,
            ...restProps,
          },
          [
            // Background rays
            React.createElement("div", {
              key: "background",
              className: "pick-gift-background",
            }),
            React.createElement("div", {
              key: "rays",
              className: "pick-gift-rays",
            }),

            // Close button
            showCloseButton &&
              React.createElement(
                "button",
                {
                  key: "close",
                  className: "pick-gift-close",
                  onClick: handleClose,
                  "aria-label": "Close gift picker",
                },
                "×"
              ),

            // Content
            React.createElement(
              "div",
              {
                key: "content",
                className: "pick-gift-content",
              },
              [
                // Title
                React.createElement(
                  "h2",
                  {
                    key: "title",
                    className: "pick-gift-title",
                  },
                  title
                ),

                // Subtitle
                subtitle &&
                  React.createElement(
                    "p",
                    {
                      key: "subtitle",
                      className: "pick-gift-subtitle",
                    },
                    subtitle
                  ),

                // Gift boxes
                React.createElement(
                  "div",
                  {
                    key: "boxes",
                    className: "pick-gift-boxes",
                  },
                  giftBoxes.map((index) =>
                    React.createElement(
                      "div",
                      {
                        key: `gift-${index}`,
                        className: cn("pick-gift-box", {
                          selected: selectedGift === index,
                          disabled: gameDisabled && selectedGift !== index,
                        }),
                        onClick: () => handleGiftClick(index),
                      },
                      React.createElement(GiftBoxIcon, {
                        className: "gift-box-icon",
                      })
                    )
                  )
                ),

                // Instructions
                !gameDisabled &&
                  React.createElement(
                    "p",
                    {
                      key: "instructions",
                      className: "text-sm opacity-80 mt-4",
                    },
                    "Click on a gift box to reveal your prize!"
                  ),

                // Loading state
                isAnimating &&
                  React.createElement(
                    "p",
                    {
                      key: "loading",
                      className: "text-sm opacity-80 mt-4",
                    },
                    "Opening your gift..."
                  ),
              ]
            ),
          ]
        ),

        // Result modal
        showResult &&
          gameResult &&
          React.createElement(
            "div",
            {
              key: "result",
              className: "pick-gift-result",
            },
            [
              React.createElement(
                "h3",
                {
                  key: "result-title",
                },
                gameResult.type !== "none" ? "Congratulations!" : "Oops!"
              ),

              React.createElement(
                "p",
                {
                  key: "result-message",
                },
                gameResult.type !== "none"
                  ? winMessage.replace("{prize}", gameResult.prize)
                  : noWinMessage
              ),

              gameResult.type !== "none" &&
                React.createElement(
                  "div",
                  {
                    key: "prize",
                    className: "prize",
                  },
                  gameResult.prize
                ),

              React.createElement(
                Button,
                {
                  key: "result-close",
                  onClick: handleResultClose,
                  variant: "outline",
                },
                "Close"
              ),
            ]
          ),
      ]
    );
  });

  PickGift.displayName = "PickGift";

  // Function to get component properties from data attributes
  function getComponentConfig(rootElement) {
    const dataset = rootElement.dataset;

    // Parse gifts from JSON string
    let gifts;
    try {
      gifts = JSON.parse(dataset.gifts || "[]");
    } catch (e) {
      console.error("Error parsing gifts:", e);
      gifts = [
        { prize: "10% Off", probability: 0.3, type: "discount" },
        { prize: "Free Shipping", probability: 0.2, type: "shipping" },
        { prize: "$5 Gift Card", probability: 0.15, type: "giftcard" },
        { prize: "20% Off", probability: 0.1, type: "discount" },
        { prize: "Free Sample", probability: 0.2, type: "sample" },
        { prize: "Try Again", probability: 0.05, type: "none" },
      ];
    }

    return {
      title:
        dataset.title ||
        "Pick a gift for a chance to win a prize for your next order!",
      subtitle: dataset.subtitle || null,
      gifts: gifts,
      numberOfGifts: parseInt(dataset.numberOfGifts) || 3,
      autoOpen: dataset.autoOpen === "true",
      showCloseButton: dataset.showCloseButton !== "false",
      winMessage: dataset.winMessage || "Congratulations! You won: {prize}",
      noWinMessage: dataset.noWinMessage || "Better luck next time!",
      variant: dataset.variant || "default",
      size: dataset.size || "default",
      animationDuration: parseInt(dataset.animationDuration) || 1000,
    };
  }

  // Initialize pick gift components
  function initPickGift() {
    // Find all pick gift components on the page
    const rootElements = document.querySelectorAll(".pick-gift-component");

    if (rootElements.length === 0) {
      console.warn("Pick Gift: No root elements found");
      return;
    }

    console.log(
      `Found ${rootElements.length} Pick Gift component(s) to initialize`
    );

    rootElements.forEach((rootElement, index) => {
      try {
        // Get configuration from data attributes
        const config = getComponentConfig(rootElement);
        console.log(`Pick Gift ${index + 1} config:`, config);

        // Find the container where React should render
        const container = rootElement.querySelector(".pick-gift-container");
        if (!container) {
          console.error(`No container found for component ${index + 1}`);
          return;
        }

        // Hide loading state
        const loadingElement = rootElement.querySelector(".pick-gift-loading");
        if (loadingElement) {
          loadingElement.style.display = "none";
        }

        // Create React root and render the component
        const root = ReactDOM.createRoot(container);
        root.render(
          React.createElement(PickGift, {
            ...config,
            onGiftPicked: (result) => {
              console.log(`Pick Gift ${index + 1} - Prize won:`, result);

              // Dispatch custom event for analytics
              const customEvent = new CustomEvent("pick-gift-result", {
                detail: {
                  componentIndex: index,
                  result: result,
                  timestamp: new Date().toISOString(),
                },
              });
              rootElement.dispatchEvent(customEvent);
            },
            onClose: () => {
              console.log(`Pick Gift ${index + 1} closed`);
            },
          })
        );

        console.log(
          `Pick Gift component ${index + 1} initialized successfully`
        );
      } catch (error) {
        console.error(
          `Error initializing Pick Gift component ${index + 1}:`,
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
  window.initPickGift = initPickGift;

  // Initialize immediately if DOM is already loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPickGift);
  } else {
    // Use setTimeout to ensure all components are rendered
    setTimeout(initPickGift, 100);
  }

  // Return the initialization function for module systems
  return {
    initPickGift: initPickGift,
    PickGift: PickGift,
  };
});
