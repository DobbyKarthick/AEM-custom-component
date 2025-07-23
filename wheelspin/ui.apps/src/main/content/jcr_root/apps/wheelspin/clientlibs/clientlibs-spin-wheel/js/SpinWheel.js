import React, { useRef, useEffect, useState, useCallback } from "react";

const SpinWheel = ({ config }) => {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [startSpinTime, setStartSpinTime] = useState(0);
  const [spinDuration, setSpinDuration] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);

  const {
    wheelSize = 500,
    animationDuration = 5000,
    minRevolutions = 5,
    maxRevolutions = 10,
    segments = [
      { text: "10% Off", color: "#FFC300" },
      { text: "Free Shipping", color: "#FF5733" },
      { text: "Buy One Get One", color: "#C70039" },
      { text: "20% Off", color: "#900C3F" },
      { text: "No Luck", color: "#581845" },
      { text: "Gift Card", color: "#2E86C1" },
    ],
    title = "Spin the Wheel!",
    buttonText = "SPIN",
    spinningText = "Spinning...",
  } = config;

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
      ctx.strokeStyle = "#FFF";
      ctx.stroke();
    });
    ctx.restore();

    // Draw text for each segment
    segments.forEach((segment, i) => {
      ctx.save();

      const segmentCenterAngle = i * arcSize + arcSize / 2;
      const currentTextAbsoluteAngle = segmentCenterAngle + rotation;

      const textX = centerX + radius * 0.7 * Math.cos(currentTextAbsoluteAngle);
      const textY = centerY + radius * 0.7 * Math.sin(currentTextAbsoluteAngle);

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
      ctx.fillStyle = "white";
      ctx.font = "bold 18px Arial";
      ctx.fillText(segment.text, 0, 0);
      ctx.restore();
    });

    // Draw pointer at the top center
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

          // Calculate winning segment
          const segmentAngle = (2 * Math.PI) / segments.length;
          const normalizedFinalRotationForWin =
            ((finalRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

          let angleUnderPointerInUnrotatedWheel =
            ((3 * Math.PI) / 2 - normalizedFinalRotationForWin + 2 * Math.PI) %
            (2 * Math.PI);

          if (angleUnderPointerInUnrotatedWheel < 0) {
            angleUnderPointerInUnrotatedWheel += 2 * Math.PI;
          }

          const winningIndex = Math.floor(
            (angleUnderPointerInUnrotatedWheel + 0.0000001) / segmentAngle
          );

          console.log("Spin result:", segments[winningIndex].text);
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
    setSpinDuration(parseInt(animationDuration));
  };

  return (
    <div className="spin-wheel-container">
      <h2 className="spin-wheel-title">{title}</h2>
      <div className="spin-wheel-canvas-container">
        <canvas
          ref={canvasRef}
          width={wheelSize}
          height={wheelSize}
          className="spin-wheel-canvas"
        />
      </div>
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="spin-wheel-button"
      >
        {spinning ? spinningText : buttonText}
      </button>
      {spinResult && (
        <div className="spin-wheel-result">Result: {spinResult}</div>
      )}
    </div>
  );
};

export default SpinWheel;
