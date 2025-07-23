/*
 * Spin Wheel Bundle with UMD wrapper
 * This bundle properly exposes the initSpinWheel function globally
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["spin-wheel"] = factory();
  else root["spin-wheel"] = factory();
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

  // Spin Wheel Component
  const SpinWheel = React.forwardRef((props, ref) => {
    const {
      className,
      segments = [
        { text: "10% Off", color: "#FFC300" },
        { text: "Free Shipping", color: "#FF5733" },
        { text: "Buy One Get One", color: "#C70039" },
        { text: "20% Off", color: "#900C3F" },
        { text: "No Luck", color: "#581845" },
        { text: "Gift Card", color: "#2E86C1" },
      ],
      wheelSize = 400,
      animationDuration = 4000,
      minRevolutions = 5,
      maxRevolutions = 8,
      title = "Spin the Wheel!",
      buttonText = "SPIN",
      spinningText = "Spinning...",
      disabled = false,
      onSpinStart,
      onSpinEnd,
      variant = "default",
      size = "default",
      ...restProps
    } = props;

    const canvasRef = React.useRef(null);
    const [spinning, setSpinning] = React.useState(false);
    const [spinResult, setSpinResult] = React.useState(null);
    const [rotation, setRotation] = React.useState(0);
    const [startSpinTime, setStartSpinTime] = React.useState(0);
    const [spinDuration, setSpinDuration] = React.useState(0);
    const [finalRotation, setFinalRotation] = React.useState(0);

    const drawWheel = React.useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw wheel shadow
      ctx.save();
      ctx.translate(centerX + 2, centerY + 2);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fill();
      ctx.restore();

      // Draw the wheel segments
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      const arcSize = (2 * Math.PI) / segments.length;

      segments.forEach((segment, i) => {
        const startAngle = i * arcSize;
        const endAngle = (i + 1) * arcSize;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
      });
      ctx.restore();

      // Draw text for each segment
      segments.forEach((segment, i) => {
        ctx.save();
        const segmentCenterAngle = i * arcSize + arcSize / 2;
        const currentTextAbsoluteAngle = segmentCenterAngle + rotation;
        const textX =
          centerX + radius * 0.7 * Math.cos(currentTextAbsoluteAngle);
        const textY =
          centerY + radius * 0.7 * Math.sin(currentTextAbsoluteAngle);

        ctx.translate(textX, textY);
        const normalizedAngle =
          ((currentTextAbsoluteAngle % (2 * Math.PI)) + 2 * Math.PI) %
          (2 * Math.PI);

        if (
          normalizedAngle > Math.PI / 2 &&
          normalizedAngle < (3 * Math.PI) / 2
        ) {
          ctx.rotate(Math.PI);
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px Arial, sans-serif";
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 2;
        ctx.fillText(segment.text, 0, 0);
        ctx.restore();
      });

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#e5e7eb";
      ctx.stroke();

      // Draw pointer
      ctx.beginPath();
      ctx.moveTo(centerX - 15, 20);
      ctx.lineTo(centerX + 15, 20);
      ctx.lineTo(centerX, 50);
      ctx.closePath();
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }, [rotation, segments]);

    React.useEffect(() => {
      drawWheel();

      if (spinning) {
        const animate = () => {
          const now = Date.now();
          const elapsed = now - startSpinTime;
          const progress = Math.min(elapsed / spinDuration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 4);

          const currentRotation = finalRotation * easedProgress;
          setRotation(currentRotation);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setSpinning(false);

            // Calculate winning segment
            const segmentAngle = (2 * Math.PI) / segments.length;
            const normalizedFinalRotation =
              ((finalRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            let angleUnderPointer =
              ((3 * Math.PI) / 2 - normalizedFinalRotation + 2 * Math.PI) %
              (2 * Math.PI);

            if (angleUnderPointer < 0) {
              angleUnderPointer += 2 * Math.PI;
            }

            const winningIndex = Math.floor(
              (angleUnderPointer + 0.0000001) / segmentAngle
            );
            const result = segments[winningIndex];

            setSpinResult(result);
            onSpinEnd?.(result);
          }
        };
        requestAnimationFrame(animate);
      }
    }, [
      spinning,
      rotation,
      startSpinTime,
      spinDuration,
      finalRotation,
      segments,
      drawWheel,
      onSpinEnd,
    ]);

    const handleSpin = () => {
      if (spinning || disabled) return;

      setSpinning(true);
      setSpinResult(null);
      onSpinStart?.();

      const totalRevolutions =
        minRevolutions + Math.random() * (maxRevolutions - minRevolutions);
      const targetSegmentIndex = Math.floor(Math.random() * segments.length);
      const segmentAngle = (2 * Math.PI) / segments.length;
      const targetSegmentCenterAngle =
        targetSegmentIndex * segmentAngle + segmentAngle / 2;
      const winningMargin = 0.0000001;
      const rotationToAlignTarget =
        ((3 * Math.PI) / 2 -
          targetSegmentCenterAngle +
          winningMargin +
          2 * Math.PI) %
        (2 * Math.PI);
      const calculatedFinalRotation =
        totalRevolutions * 2 * Math.PI + rotationToAlignTarget;

      setFinalRotation(calculatedFinalRotation);
      setStartSpinTime(Date.now());
      setSpinDuration(animationDuration);
    };

    const spinWheelClasses = cn(
      "relative flex flex-col items-center justify-center",
      {
        "max-w-sm": size === "sm",
        "max-w-md": size === "default",
        "max-w-lg": size === "lg",
        "max-w-xl": size === "xl",
      },
      {
        "bg-background": variant === "default",
        "bg-card border rounded-lg p-6 shadow-sm": variant === "card",
        "bg-transparent": variant === "minimal",
      },
      className
    );

    return React.createElement(
      "div",
      {
        ref: ref,
        className: spinWheelClasses,
        ...restProps,
      },
      [
        title &&
          React.createElement(
            "h2",
            {
              key: "title",
              className: "text-2xl font-bold mb-6 text-center text-foreground",
            },
            title
          ),

        React.createElement(
          "div",
          {
            key: "wheel-container",
            className: "relative mb-6",
          },
          [
            React.createElement("canvas", {
              key: "canvas",
              ref: canvasRef,
              width: wheelSize,
              height: wheelSize,
              className: "rounded-full shadow-lg",
              style: { filter: spinning ? "blur(0.5px)" : "none" },
            }),

            spinning &&
              React.createElement(
                "div",
                {
                  key: "spinning-overlay",
                  className:
                    "absolute inset-0 flex items-center justify-center",
                },
                React.createElement(
                  "div",
                  {
                    className:
                      "bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium",
                  },
                  spinningText
                )
              ),
          ]
        ),

        React.createElement(
          Button,
          {
            key: "spin-button",
            onClick: handleSpin,
            disabled: spinning || disabled,
            size: "lg",
            className: "min-w-[120px] font-semibold",
          },
          spinning ? spinningText : buttonText
        ),

        spinResult &&
          !spinning &&
          React.createElement(
            "div",
            {
              key: "result",
              className:
                "mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center",
            },
            [
              React.createElement(
                "p",
                {
                  key: "result-label",
                  className: "text-sm font-medium text-muted-foreground mb-1",
                },
                "Congratulations! You won:"
              ),
              React.createElement(
                "p",
                {
                  key: "result-text",
                  className: "text-lg font-bold text-primary",
                },
                spinResult.text
              ),
            ]
          ),
      ]
    );
  });

  SpinWheel.displayName = "SpinWheel";

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

  // Initialize spin wheel components
  function initSpinWheel() {
    // Find all spin wheel components on the page
    const rootElements = document.querySelectorAll(".spin-wheel-component");

    if (rootElements.length === 0) {
      console.warn("Spin Wheel: No root elements found");
      return;
    }

    console.log(
      `Found ${rootElements.length} Spin Wheel component(s) to initialize`
    );

    rootElements.forEach((rootElement, index) => {
      try {
        // Get configuration from data attributes
        const config = getComponentConfig(rootElement);
        console.log(`Spin Wheel ${index + 1} config:`, config);

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

        // Create React root and render the component
        const root = ReactDOM.createRoot(container);
        root.render(
          React.createElement(SpinWheel, {
            ...config,
            onSpinStart: () => {
              console.log(`Spin Wheel ${index + 1} started spinning`);
            },
            onSpinEnd: (result) => {
              console.log(`Spin Wheel ${index + 1} stopped. Result:`, result);
            },
          })
        );

        console.log(
          `Spin Wheel component ${index + 1} initialized successfully`
        );
      } catch (error) {
        console.error(
          `Error initializing Spin Wheel component ${index + 1}:`,
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

  // Initialize immediately if DOM is already loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSpinWheel);
  } else {
    // Use setTimeout to ensure all components are rendered
    setTimeout(initSpinWheel, 100);
  }

  // Return the initialization function for module systems
  return {
    initSpinWheel: initSpinWheel,
    SpinWheel: SpinWheel,
  };
});
