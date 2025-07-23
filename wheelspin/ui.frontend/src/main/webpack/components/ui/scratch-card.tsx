import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { defaultScratchCardConfig, type ScratchCardConfig, loadFromComponentProps } from "@/lib/config-loader";

// Extend Window interface for AEM configuration
declare global {
  interface Window {
    scratchCardConfig?: any;
  }
}

const scratchCardVariants = cva(
  "relative flex flex-col items-center justify-center",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
      variant: {
        default: "bg-background",
        card: "bg-card border rounded-lg p-6 shadow-sm",
        minimal: "bg-transparent",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

interface ScratchCardPrize {
  text: string;
  value?: string;
  color?: string;
  icon?: string;
}

interface ScratchCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scratchCardVariants> {
  prizes: ScratchCardPrize[];
  cardWidth?: number;
  cardHeight?: number;
  brushRadius?: number; // Added missing property
  scratchColor?: string;
  scratchPattern?: string;
  revealThreshold?: number;
  title?: string;
  resetButtonText?: string;
  instructions?: string;
  disabled?: boolean;
  onScratchStart?: () => void;
  onScratchProgress?: (percentage: number) => void;
  onReveal?: (prize: ScratchCardPrize) => void;
  onReset?: () => void;
}

const ScratchCard = React.forwardRef<HTMLDivElement, ScratchCardProps>(
  (
    {
      className,
      size,
      variant,
      prizes = defaultScratchCardConfig.prizes,
      cardWidth = defaultScratchCardConfig.defaults.cardWidth,
      cardHeight = defaultScratchCardConfig.defaults.cardHeight,
      brushRadius = 20,
      scratchColor = defaultScratchCardConfig.defaults.scratchColor,
      scratchPattern = defaultScratchCardConfig.defaults.scratchPattern,
      revealThreshold = defaultScratchCardConfig.defaults.revealThreshold,
      title = defaultScratchCardConfig.defaults.title,
      resetButtonText = defaultScratchCardConfig.defaults.resetButtonText,
      instructions = defaultScratchCardConfig.defaults.instructions,
      disabled = false,
      onScratchStart,
      onScratchProgress,
      onReveal,
      onReset,
      ...props
    },
    ref
  ) => {
    // Load configuration from AEM component properties or use defaults
    const config = loadFromComponentProps(window.scratchCardConfig || {}, defaultScratchCardConfig);
    const finalPrizes = prizes.length > 0 ? prizes : config.prizes;
    const finalCardWidth = cardWidth || config.defaults.cardWidth;
    const finalCardHeight = cardHeight || config.defaults.cardHeight;
    const finalScratchColor = scratchColor || config.defaults.scratchColor;
    const finalScratchPattern = scratchPattern || config.defaults.scratchPattern;
    const finalRevealThreshold = revealThreshold || config.defaults.revealThreshold;
    const finalTitle = title || config.defaults.title;
    const finalResetButtonText = resetButtonText || config.defaults.resetButtonText;
    const finalInstructions = instructions || config.defaults.instructions;

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [isScratching, setIsScratching] = React.useState(false);
    const [scratchedPixels, setScratchedPixels] = React.useState(0);
    const [totalPixels, setTotalPixels] = React.useState(0);
    const [isRevealed, setIsRevealed] = React.useState(false);
    const [hasStarted, setHasStarted] = React.useState(false);

    const initializeCanvas = React.useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = finalCardWidth;
      canvas.height = finalCardHeight;

      // Draw the scratch surface
      ctx.fillStyle = finalScratchColor;
      ctx.fillRect(0, 0, finalCardWidth, finalCardHeight);

      // Add scratch pattern text
      ctx.fillStyle = "#666";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(finalScratchPattern, finalCardWidth / 2, finalCardHeight / 2);

      // Add some decorative elements
      ctx.strokeStyle = "#999";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(10, 10, finalCardWidth - 20, finalCardHeight - 20);

      // Calculate total pixels for percentage calculation
      const imageData = ctx.getImageData(0, 0, finalCardWidth, finalCardHeight);
      setTotalPixels(imageData.data.length / 4);
      setScratchedPixels(0);
      setIsRevealed(false);
      setHasStarted(false);
    }, [finalCardWidth, finalCardHeight, finalScratchColor, finalScratchPattern]);

    React.useEffect(() => {
      initializeCanvas();
    }, [initializeCanvas]);

    const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;

      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const scratch = (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();

      // Calculate scratched percentage
      const imageData = ctx.getImageData(0, 0, finalCardWidth, finalCardHeight);
      let transparent = 0;
      
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) {
          transparent++;
        }
      }

      const percentage = (transparent / totalPixels) * 100;
      setScratchedPixels(transparent);
      onScratchProgress?.(percentage);

      if (percentage >= finalRevealThreshold && !isRevealed) {
        setIsRevealed(true);
        onReveal?.(finalPrizes[0]); // Assuming the first prize is the one revealed
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled || isRevealed) return;
      
      setIsScratching(true);
      if (!hasStarted) {
        setHasStarted(true);
        onScratchStart?.();
      }
      
      const pos = getEventPosition(e);
      scratch(pos.x, pos.y);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isScratching || disabled || isRevealed) return;
      
      const pos = getEventPosition(e);
      scratch(pos.x, pos.y);
    };

    const handleMouseUp = () => {
      setIsScratching(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      e.preventDefault();
      if (disabled || isRevealed) return;
      
      setIsScratching(true);
      if (!hasStarted) {
        setHasStarted(true);
        onScratchStart?.();
      }
      
      const pos = getEventPosition(e);
      scratch(pos.x, pos.y);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      e.preventDefault();
      if (!isScratching || disabled || isRevealed) return;
      
      const pos = getEventPosition(e);
      scratch(pos.x, pos.y);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      e.preventDefault();
      setIsScratching(false);
    };

    const handleReset = () => {
      initializeCanvas();
      onReset?.();
    };

    const scratchPercentage = totalPixels > 0 ? (scratchedPixels / totalPixels) * 100 : 0;

    return (
      <div
        ref={ref}
        className={cn(scratchCardVariants({ size, variant, className }))}
        {...props}
      >
        {finalTitle && (
          <h2 className="text-2xl font-bold mb-4 text-center text-foreground">
            {finalTitle}
          </h2>
        )}

        {finalInstructions && !hasStarted && (
          <p className="text-sm text-muted-foreground mb-4 text-center">
            {finalInstructions}
          </p>
        )}

        <div className="relative mb-4">
          {/* Prize display (behind the scratch surface) */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg shadow-lg border-2 border-gray-300"
            style={{
              width: finalCardWidth,
              height: finalCardHeight,
              backgroundColor: finalPrizes[0].color || "#f3f4f6",
            }}
          >
            <div className="text-center">
              {finalPrizes[0].icon && (
                <div className="text-4xl mb-2">{finalPrizes[0].icon}</div>
              )}
              <div className="text-xl font-bold text-white drop-shadow-lg">
                {finalPrizes[0].text}
              </div>
              {finalPrizes[0].value && (
                <div className="text-sm text-white/90 mt-1">
                  {finalPrizes[0].value}
                </div>
              )}
            </div>
          </div>

          {/* Scratch canvas */}
          <canvas
            ref={canvasRef}
            className="relative rounded-lg shadow-lg cursor-crosshair"
            style={{
              touchAction: "none",
              opacity: isRevealed ? 0.1 : 1,
              transition: "opacity 0.3s ease",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* Progress indicator */}
          {hasStarted && !isRevealed && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              {Math.round(scratchPercentage)}%
            </div>
          )}
        </div>

        {/* Result display */}
        {isRevealed && (
          <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Congratulations! You won:
            </p>
            <p className="text-lg font-bold text-primary">{finalPrizes[0].text}</p>
            {finalPrizes[0].value && (
              <p className="text-sm text-muted-foreground mt-1">{finalPrizes[0].value}</p>
            )}
          </div>
        )}

        {/* Reset button */}
        {isRevealed && (
          <Button
            onClick={handleReset}
            disabled={disabled}
            variant="outline"
            size="lg"
            className="min-w-[120px]"
          >
            {finalResetButtonText}
          </Button>
        )}
      </div>
    );
  }
);

ScratchCard.displayName = "ScratchCard";

export {
  ScratchCard,
  scratchCardVariants,
  type ScratchCardProps,
  type ScratchCardPrize,
}; 