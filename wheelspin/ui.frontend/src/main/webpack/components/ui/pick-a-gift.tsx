import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { defaultPickAGiftConfig, type PickAGiftConfig, loadFromComponentProps } from "@/lib/config-loader";

// Extend Window interface for AEM configuration
declare global {
  interface Window {
    pickGiftConfig?: any;
  }
}

const pickAGiftVariants = cva(
  "relative w-full flex flex-col items-center justify-center",
  {
    variants: {
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface PickAGiftPrize {
  text: string;
  value?: string;
  color?: string;
  icon?: string;
  probability?: number;
}

interface PickAGiftProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pickAGiftVariants> {
  title?: string;
  subtitle?: string; // Added missing property
  prizes: PickAGiftPrize[];
  autoOpen?: boolean;
  showCloseButton?: boolean;
  animationDuration?: number;
  onGiftSelect?: (index: number) => void;
  onReveal?: (prize: PickAGiftPrize) => void;
  onReset?: () => void;
}

const PickAGift = React.forwardRef<HTMLDivElement, PickAGiftProps>(
  (
    {
      className,
      size,
      prizes = defaultPickAGiftConfig.prizes,
      title = defaultPickAGiftConfig.defaults.title,
      subtitle = defaultPickAGiftConfig.defaults.subtitle,
      autoOpen = defaultPickAGiftConfig.defaults.autoOpen,
      showCloseButton = defaultPickAGiftConfig.defaults.showCloseButton,
      animationDuration = defaultPickAGiftConfig.defaults.animationDuration,
      onGiftSelect,
      onReveal,
      onReset,
      ...props
    },
    ref
  ) => {
    // Load configuration from AEM component properties or use defaults
    const config = loadFromComponentProps(window.pickGiftConfig || {}, defaultPickAGiftConfig);
    const finalPrizes = prizes.length > 0 ? prizes : config.prizes;
    const finalTitle = title || config.defaults.title;
    const finalSubtitle = subtitle || config.defaults.subtitle;
    const finalAutoOpen = autoOpen !== undefined ? autoOpen : config.defaults.autoOpen;
    const finalShowCloseButton = showCloseButton !== undefined ? showCloseButton : config.defaults.showCloseButton;
    const finalAnimationDuration = animationDuration || config.defaults.animationDuration;

    const [selectedGift, setSelectedGift] = React.useState<number | null>(null);
    const [revealedPrize, setRevealedPrize] = React.useState<PickAGiftPrize | null>(null);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [giftBoxes, setGiftBoxes] = React.useState<PickAGiftPrize[]>([]);

    // Initialize gift boxes from final prizes
    React.useEffect(() => {
      setGiftBoxes(finalPrizes);
    }, [finalPrizes]);

    const handleGiftSelect = (giftIndex: number) => {
      if (selectedGift !== null || isAnimating) return;

      setIsAnimating(true);
      setSelectedGift(giftIndex);
      onGiftSelect?.(giftIndex);

      // Animate the reveal
      setTimeout(() => {
        const prize = giftBoxes[giftIndex];
        setRevealedPrize(prize);
        setIsAnimating(false);
        onReveal?.(prize);
      }, 1000);
    };

    const handleReset = () => {
      setSelectedGift(null);
      setRevealedPrize(null);
      setIsAnimating(false);
      
      // Regenerate gift boxes from final prizes
      setGiftBoxes(finalPrizes);
      
      onReset?.();
    };

    return (
      <div
        ref={ref}
        className={cn(pickAGiftVariants({ size, className }))}
        {...props}
      >
        {/* Purple Gradient Background with Rays */}
        <div 
          className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl mx-auto"
          style={{
            background: `
              radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)
            `,
            backgroundSize: '30px 30px, 100% 100%',
            minHeight: '400px'
          }}
        >
          {/* Radial rays effect */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                repeating-conic-gradient(
                  from 0deg at 50% 50%,
                  transparent 0deg,
                  rgba(255, 255, 255, 0.3) 2deg,
                  transparent 4deg
                )
              `
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              {finalTitle}
            </h2>
            {finalSubtitle && (
              <p className="text-lg text-white/80 mb-8">
                {finalSubtitle}
              </p>
            )}

            {/* Gift Boxes */}
            {!revealedPrize ? (
              <div className="flex justify-center items-center space-x-8 mb-8">
                {giftBoxes.map((gift, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative cursor-pointer transition-all duration-300 hover:scale-110",
                      selectedGift === index && isAnimating && "animate-pulse scale-110"
                    )}
                    onClick={() => handleGiftSelect(index)}
                  >
                    {/* Gift Box */}
                    <div 
                      className="w-24 h-24 md:w-32 md:h-32 rounded-lg shadow-lg relative"
                      style={{
                        background: gift.color || 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        border: `2px solid ${gift.color ? darkenColor(gift.color, 20) : '#7f1d1d'}`
                      }}
                    >
                      {/* Gift Box Highlight */}
                      <div 
                        className="absolute inset-2 rounded-md opacity-30"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%)'
                        }}
                      />

                      {/* Ribbon Vertical */}
                      <div 
                        className="absolute left-1/2 top-0 bottom-0 w-3 md:w-4 -ml-1.5 md:-ml-2"
                        style={{
                          background: 'linear-gradient(90deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
                        }}
                      />

                      {/* Ribbon Horizontal */}
                      <div 
                        className="absolute top-1/2 left-0 right-0 h-3 md:h-4 -mt-1.5 md:-mt-2"
                        style={{
                          background: 'linear-gradient(180deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
                        }}
                      />

                      {/* Bow */}
                      <div className="absolute -top-2 left-1/2 -ml-3 md:-ml-4">
                        <div className="relative">
                          {/* Bow Left */}
                          <div 
                            className="absolute w-3 h-4 md:w-4 md:h-5 -left-1 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                              transform: 'rotate(-30deg)'
                            }}
                          />
                          {/* Bow Right */}
                          <div 
                            className="absolute w-3 h-4 md:w-4 md:h-5 -right-1 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                              transform: 'rotate(30deg)'
                            }}
                          />
                          {/* Bow Center */}
                          <div 
                            className="absolute w-2 h-2 md:w-3 md:h-3 -left-1 top-1 rounded-full"
                            style={{
                              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {selectedGift === index && isAnimating && (
                      <div className="absolute inset-0 rounded-lg border-4 border-yellow-400 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Prize Reveal */
              <div className="text-center mb-8">
                <div className="inline-block p-8 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl">
                  <div className="text-6xl mb-4">{revealedPrize.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Congratulations!
                  </h3>
                  <p className="text-xl text-white/90 mb-2">
                    You won: <span className="font-bold">{revealedPrize.text}</span>
                  </p>
                  {revealedPrize.value && (
                    <p className="text-white/80 text-sm">
                      {revealedPrize.value}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {revealedPrize ? (
                <>
                  <Button
                    onClick={handleReset}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                    size="lg"
                  >
                    Play Again
                  </Button>
                  <Button
                    className="bg-white text-purple-600 hover:bg-gray-100"
                    size="lg"
                  >
                    Claim Prize
                  </Button>
                </>
              ) : (
                <p className="text-white/80 text-sm mt-4">
                  Choose any gift box to reveal your prize!
                </p>
              )}
            </div>

            {/* Loading Animation */}
            {isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
                  <p className="text-white text-lg font-medium">
                    Opening your gift...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prize Information */}
        <div className="mt-8 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-center">Available Prizes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {prizes.map((prize, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg text-center border"
                style={{ borderColor: prize.color || '#e5e7eb' }}
              >
                <div className="text-2xl mb-1">{prize.icon}</div>
                <div className="font-medium text-sm">{prize.text}</div>
                {prize.value && (
                  <div className="text-xs text-gray-500 mt-1">{prize.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

PickAGift.displayName = "PickAGift";

export {
  PickAGift,
  pickAGiftVariants,
  type PickAGiftProps,
  type PickAGiftPrize,
}; 

function darkenColor(hex: string, percent: number) {
  const f = parseInt(hex.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = (f >> 16);
  const G = (f >> 8) & 0x00FF;
  const B = f & 0x0000FF;

  const newR = Math.round((t - R) * p / 100) + R;
  const newG = Math.round((t - G) * p / 100) + G;
  const newB = Math.round((t - B) * p / 100) + B;

  return "#" + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
} 