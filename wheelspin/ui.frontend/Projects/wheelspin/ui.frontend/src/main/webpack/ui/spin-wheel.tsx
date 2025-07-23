import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const spinWheelVariants = cva(
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

interface SpinWheelSegment {
  text: string;
  color: string;
  value?: string;
}

interface SpinWheelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinWheelVariants> {
  segments: SpinWheelSegment[];
  wheelSize?: number;
  animationDuration?: number;
  minRevolutions?: number;
  maxRevolutions?: number;
  title?: string;
  buttonText?: string;
  spinningText?: string;
  disabled?: boolean;
  onSpinStart?: () => void;
  onSpinEnd?: (result: SpinWheelSegment) => void;
}

const SpinWheel = React.forwardRef<HTMLDivElement, SpinWheelProps>(
  (
    {
      className,
      size,
      variant,
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
      ...props
    },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [spinning, setSpinning] = React.useState(false);
    const [spinResult, setSpinResult] = React.useState<SpinWheelSegment | null>(
      null
    );
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

        // Add subtle gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
        ctx.fillStyle = gradient;
        ctx.fill();
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
        ctx.font =
          "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
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

    return (
      <div
        ref={ref}
        className={cn(spinWheelVariants({ size, variant, className }))}
        {...props}
      >
        {title && (
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
            {title}
          </h2>
        )}

        <div className="relative mb-6">
          <canvas
            ref={canvasRef}
            width={wheelSize}
            height={wheelSize}
            className="rounded-full shadow-lg"
            style={{ filter: spinning ? "blur(0.5px)" : "none" }}
          />
          {spinning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                {spinningText}
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleSpin}
          disabled={spinning || disabled}
          size="lg"
          className="min-w-[120px] font-semibold"
        >
          {spinning ? spinningText : buttonText}
        </Button>

        {spinResult && !spinning && (
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Congratulations! You won:
            </p>
            <p className="text-lg font-bold text-primary">{spinResult.text}</p>
          </div>
        )}
      </div>
    );
  }
);

SpinWheel.displayName = "SpinWheel";

export {
  SpinWheel,
  spinWheelVariants,
  type SpinWheelProps,
  type SpinWheelSegment,
};
