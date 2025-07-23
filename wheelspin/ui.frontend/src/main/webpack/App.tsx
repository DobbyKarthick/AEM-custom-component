import { ScratchCard } from "@/components/ui/scratch-card";
import { PickAGift } from "@/components/ui/pick-a-gift";
import { SpinWheel } from "@/components/ui/spin-wheel";
import "./index.css";

const wheelSegments = [
  { text: "10% Off", color: "#FFC300" },
  { text: "Free Shipping", color: "#FF5733" },
  { text: "Buy One Get One", color: "#C70039" },
  { text: "20% Off", color: "#900C3F" },
  { text: "No Luck", color: "#581845" },
  { text: "Gift Card", color: "#2E86C1" },
];

const scratchPrize = {
  text: "50% OFF",
  value: "Use code: SCRATCH50",
  color: "#e74c3c",
  icon: "🎯",
};

const giftPrizes = [
  { text: "30% OFF", value: "Use code: GIFT30", color: "#e74c3c", icon: "🎯" },
  { text: "Free Shipping", value: "On orders over $25", color: "#3498db", icon: "🚚" },
  { text: "$15 Gift Card", value: "Valid for 60 days", color: "#27ae60", icon: "💳" },
];

function App() {
  const scratchCardPrizes = [
    { text: "Win a Car!", value: "New Sedan", color: "#ff0000", icon: "🚗" },
    { text: "Free Coffee", value: "Any size", color: "#aadd55", icon: "☕" },
    { text: "25% Off", value: "Next Purchase", color: "#3366ff", icon: "🛒" },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gamification Components</h1>
      </header>
      <main className="container mx-auto p-4 space-y-8">
        {/* Spin Wheel */}
        <section className="border p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Spin the Wheel (Local)</h2>
          <SpinWheel
            segments={wheelSegments}
            wheelSize={500}
            animationDuration={4000}
            title="Local Spin Wheel!"
            buttonText="Spin Me!"
            onSpinEnd={(result) => console.log("Local Spin Result:", result)}
          />
        </section>

        {/* Scratch Card */}
        <section className="border p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Scratch Card (Local)</h2>
          <ScratchCard
            cardWidth={300}
            cardHeight={200}
            brushRadius={20}
            scratchColor="#c0c0c0"
            scratchPattern="Scratch Here!"
            revealThreshold={60}
            resetButtonText="Try Again"
            prizes={scratchCardPrizes}
            onReveal={(prize) => console.log("Local Scratch Card Revealed:", prize)}
          />
        </section>

        {/* Pick a Gift */}
        <section className="border p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Pick a Gift (Local)</h2>
          <PickAGift
            title="Local Pick a Gift!"
            subtitle="Choose wisely!"
            prizes={giftPrizes}
            autoOpen={false}
            showCloseButton={true}
            animationDuration={1000}
            onGiftSelect={(index) => console.log("Local Gift Selected:", index)}
            onReveal={(prize) => console.log("Local Gift Revealed:", prize)}
            onReset={() => console.log("Local Gift Reset")}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
