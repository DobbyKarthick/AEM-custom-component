import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { defaultSpinWheelConfig, loadFromComponentProps } from "@/lib/config-loader";

// Extend Window interface for AEM configuration
declare global {
  interface Window {
    wheelspinConfig?: any;
  }
}

interface Segment {
  text: string;
  color: string;
  value?: string;
}

const Wheel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0); // Current rotation angle
  const [startSpinTime, setStartSpinTime] = useState<number>(0);
  const [spinDuration, setSpinDuration] = useState<number>(0);
  const [finalRotation, setFinalRotation] = useState<number>(0);

  // Load configuration from AEM component properties or use defaults
  const config = loadFromComponentProps(window.wheelspinConfig || {}, defaultSpinWheelConfig);
  const segments: Segment[] = config.segments;

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the wheel segments (this part rotates)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation); // Apply wheel rotation

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
      ctx.strokeStyle = "#FFF";
      ctx.stroke();
    });
    ctx.restore();

    // Draw text for each segment (text should remain upright, facing outwards)
    segments.forEach((segment, i) => {
      ctx.save();

      const segmentCenterAngle = i * arcSize + arcSize / 2;
      const currentTextAbsoluteAngle = segmentCenterAngle + rotation;

      const textX = centerX + radius * 0.7 * Math.cos(currentTextAbsoluteAngle);
      const textRadius = radius * 0.7; // Position text at 70% of radius

      // Rotate to the segment's center angle
      ctx.rotate(segmentCenterAngle);
      
      // Set text properties for radial orientation
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Arial, sans-serif";
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Draw text radially (like clock needles pointing toward center)
      ctx.fillText(segment.text, textRadius, 0);
      ctx.restore();
    });

    // Draw pointer at the top center (fixed position)
    ctx.beginPath();
    ctx.moveTo(centerX - 15, 0);
    ctx.lineTo(centerX + 15, 0);
    ctx.lineTo(centerX, 40);
    ctx.closePath();
    ctx.fillStyle = "#FF4500";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFF";
    ctx.stroke();
  }, [rotation, segments]);

  useEffect(() => {
    drawWheel();

    if (spinning) {
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startSpinTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 5);

        const currentRotation = finalRotation * easedProgress;
        setRotation(currentRotation);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setSpinning(false);

          // Calculate winning segment based on final rotation (finalRotation is the total rotation after easing)
          const segmentAngle = (2 * Math.PI) / segments.length;

          // Normalize final rotation to be between 0 and 2*PI (representing where the wheel stops within one revolution)
          const normalizedFinalRotationForWin =
            ((finalRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

          // The angle on the *unrotated* wheel that is currently under the pointer (3*PI/2 on the canvas)
          // If the wheel rotated clockwise by `normalizedFinalRotationForWin`, a point `X` on the unrotated wheel
          // is now at `(X + normalizedFinalRotationForWin) % (2*PI)` on the canvas.
          // We want this to be `3 * Math.PI / 2` (the pointer's fixed angle).
          // So, `X = (3 * Math.PI / 2 - normalizedFinalRotationForWin + N * 2 * Math.PI) % (2 * Math.PI)`
          let angleUnderPointerInUnrotatedWheel =
            ((3 * Math.PI) / 2 - normalizedFinalRotationForWin + 2 * Math.PI) %
            (2 * Math.PI);

          // Ensure positive angle
          if (angleUnderPointerInUnrotatedWheel < 0) {
            angleUnderPointerInUnrotatedWheel += 2 * Math.PI;
          }

          // Determine the winning index based on this angle in the unrotated wheel's coordinate system
          // Add a small epsilon to handle floating point inaccuracies near segment boundaries
          const winningIndex = Math.floor(
            (angleUnderPointerInUnrotatedWheel + 0.0000001) / segmentAngle
          );

          console.log("--- Spin Result Debug ---");
          console.log(
            "Final Rotation (total degrees):",
            (finalRotation * 180) / Math.PI
          );
          console.log(
            "Normalized Final Rotation (0-360 deg):",
            (normalizedFinalRotationForWin * 180) / Math.PI
          );
          console.log(
            "Angle Under Pointer in Unrotated Wheel (0-360 deg):",
            (angleUnderPointerInUnrotatedWheel * 180) / Math.PI
          );
          console.log("Segment Angle (deg):", (segmentAngle * 180) / Math.PI);
          console.log("Calculated Winning Index:", winningIndex);
          console.log("Winning Prize:", segments[winningIndex].text);
          console.log("-------------------------");

          setSpinResult(segments[winningIndex].text);
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
  ]);

  const handleSpin = () => {
    if (spinning) return;

    setSpinning(true);
    setSpinResult(null);

    const minRevolutions = 5;
    const maxRevolutions = 10;
    const totalRevolutions =
      minRevolutions + Math.random() * (maxRevolutions - minRevolutions);

    const targetSegmentIndex = Math.floor(Math.random() * segments.length);
    const segmentAngle = (2 * Math.PI) / segments.length;

    // Calculate the target angle for the chosen segment to land at the pointer (top center).
    // The center of the winning segment should align with the pointer (at 3*PI/2 radians on the canvas).

    // Angle of the center of the target segment if the wheel were at 0 rotation
    const targetSegmentCenterAngle =
      targetSegmentIndex * segmentAngle + segmentAngle / 2;

    // We want this targetSegmentCenterAngle to end up at the pointer's angle (3*PI/2).
    // The rotation needed is `(pointer_angle - target_segment_center_angle)`.
    // Since the wheel rotates clockwise, this value needs to be positive.
    // `rotationToAlignTarget` is the additional rotation needed to bring the target segment's center to the pointer.

    const winningMargin = 0.0000001; // A very small offset to ensure it lands just inside the segment
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
    setSpinDuration(5000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-5">
      <h2 className="text-3xl font-bold mb-5 text-gray-800">Spin the Wheel!</h2>
      <div className="relative w-[520px] h-[520px] flex items-center justify-center rounded-full shadow-lg mb-8">
        <canvas
          ref={canvasRef}
          width="500"
          height="500"
          className="rounded-full border-[10px] border-gray-800 box-content"
        ></canvas>
      </div>
      <Button
        onClick={handleSpin}
        disabled={spinning}
        className="mt-8 px-8 py-4 text-xl font-bold rounded-full bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg uppercase tracking-wide transition-all duration-300 ease-in-out hover:from-green-600 hover:to-green-500 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
      >
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {spinResult && (
        <p className="mt-5 text-2xl font-bold text-blue-600 text-shadow-md">
          Result: {spinResult}
        </p>
      )}
    </div>
  );
};

export default Wheel;
