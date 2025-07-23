import React, { useState, useRef } from "react";

interface Prize {
  name: string;
}

const prizes: Prize[] = [
  { name: "10% Off" },
  { name: "Free Shipping" },
  { name: "Buy One Get One" },
  { name: "20% Off" },
  { name: "No Luck" },
  { name: "Gift Card" },
];

const segmentColors = [
  "#FFC300", // Gold
  "#FF5733", // Orange-Red
  "#C70039", // Dark Red
  "#900C3F", // Deep Purple
  "#581845", // Dark Violet
  "#2E86C1", // Cerulean
];

const Wheel: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    const newRotation = rotation + Math.floor(Math.random() * 360) + 360 * 5; // Spin at least 5 full rotations
    setRotation(newRotation);

    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 4s ease-out";
      wheelRef.current.style.transform = `rotate(${newRotation}deg)`;

      const totalDegrees = newRotation % 360; // Get actual rotation within 360 degrees
      const segmentAngle = 360 / prizes.length;
      const winningSegmentIndex = Math.floor(
        ((360 - totalDegrees + segmentAngle / 2) % 360) / segmentAngle
      );
      const winningPrize = prizes[winningSegmentIndex];

      setTimeout(() => {
        alert(`You won: ${winningPrize.name}`);
      }, 4000); // Alert after transition ends
    }
  };

  const numSegments = prizes.length;
  const segmentAngle = 360 / numSegments;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        ref={wheelRef}
        className="relative w-80 h-80 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
        style={{
          transition: "transform 0s",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {prizes.map((prize, index) => (
          <div
            key={index}
            className="absolute top-0 left-1/2 w-1/2 h-full origin-[0%_50%]"
            style={{
              backgroundColor: segmentColors[index % segmentColors.length],
              transform: `rotate(${index * segmentAngle}deg)`,
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
            }}
          >
            <span
              className="absolute text-white font-bold"
              style={{
                transform: `rotate(${
                  -index * segmentAngle - segmentAngle / 2
                }deg) translate(-50%, -50%)`,
                whiteSpace: "nowrap",
                left: "75%",
                top: "50%",
              }}
            >
              {prize.name}
            </span>
          </div>
        ))}
      </div>
      <div
        className="absolute top-0 w-6 h-6 bg-yellow-400 transform -translate-x-1/2 -translate-y-full rotate-45"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      ></div>
      <button
        onClick={spinWheel}
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition-colors"
      >
        Spin
      </button>
    </div>
  );
};

export default Wheel;
