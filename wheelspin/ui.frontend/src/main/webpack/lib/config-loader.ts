// Configuration loader utility for AEM gamification components
// Supports both JSON files and AEM content fragments

export interface SpinWheelConfig {
  segments: Array<{
    text: string;
    color: string;
    value?: string;
  }>;
  defaults: {
    wheelSize: number;
    animationDuration: number;
    minRevolutions: number;
    maxRevolutions: number;
    title: string;
    buttonText: string;
    spinningText: string;
  };
}

export interface PickAGiftConfig {
  prizes: Array<{
    text: string;
    value?: string;
    color?: string;
    icon?: string;
    probability?: number;
  }>;
  defaults: {
    title: string;
    subtitle: string;
    autoOpen: boolean;
    showCloseButton: boolean;
    animationDuration: number;
    variant: string;
    size: string;
  };
}

export interface ScratchCardConfig {
  prizes: Array<{
    text: string;
    value?: string;
    color?: string;
    icon?: string;
  }>;
  defaults: {
    cardWidth: number;
    cardHeight: number;
    scratchColor: string;
    scratchPattern: string;
    revealThreshold: number;
    title: string;
    resetButtonText: string;
    instructions: string;
    variant: string;
    size: string;
  };
}

// Base interface for all configurations
export interface BaseConfig {
  segments?: any[];
  prizes?: any[];
  defaults?: any;
}

// Default configurations (fallback if external configs are not available)
export const defaultSpinWheelConfig: SpinWheelConfig = {
  segments: [
    { text: "10% Off", color: "#FFC300", value: "DISCOUNT10" },
    { text: "Free Shipping", color: "#FF5733", value: "FREESHIP" },
    { text: "Buy One Get One", color: "#C70039", value: "BOGO" },
    { text: "20% Off", color: "#900C3F", value: "DISCOUNT20" },
    { text: "No Luck", color: "#581845", value: "NOLUCK" },
    { text: "Gift Card", color: "#2E86C1", value: "GIFTCARD" },
  ],
  defaults: {
    wheelSize: 400,
    animationDuration: 4000,
    minRevolutions: 5,
    maxRevolutions: 8,
    title: "Spin the Wheel!",
    buttonText: "SPIN",
    spinningText: "Spinning...",
  },
};

export const defaultPickAGiftConfig: PickAGiftConfig = {
  prizes: [
    { text: "30% OFF", value: "Use code: GIFT30", color: "#e74c3c", icon: "🎯", probability: 0.15 },
    { text: "Free Shipping", value: "On orders over $25", color: "#3498db", icon: "🚚", probability: 0.20 },
    { text: "$15 Gift Card", value: "Valid for 60 days", color: "#27ae60", icon: "💳", probability: 0.10 },
    { text: "Buy 1 Get 1 Free", value: "Select items only", color: "#f39c12", icon: "🎁", probability: 0.08 },
    { text: "Try Again!", value: "Better luck next time", color: "#95a5a6", icon: "🔄", probability: 0.25 },
    { text: "20% OFF", value: "Use code: PICK20", color: "#9b59b6", icon: "🍀", probability: 0.12 },
    { text: "Free Sample", value: "Choose any product", color: "#8e44ad", icon: "🎪", probability: 0.05 },
    { text: "VIP Access", value: "Exclusive member benefits", color: "#d35400", icon: "👑", probability: 0.05 },
  ],
  defaults: {
    title: "Choose a Gift!",
    subtitle: "Pick one of the gift boxes to reveal your prize",
    autoOpen: false,
    showCloseButton: true,
    animationDuration: 1000,
    variant: "default",
    size: "default",
  },
};

export const defaultScratchCardConfig: ScratchCardConfig = {
  prizes: [
    { text: "25% Discount", value: "Code: SCRATCH25", color: "#4CAF50", icon: "🎉" },
    { text: "Free Coffee", value: "Any size", color: "#aadd55", icon: "☕" },
    { text: "Win a Car!", value: "New Sedan", color: "#ff0000", icon: "🚗" },
    { text: "Try Again!", value: "Better luck next time", color: "#95a5a6", icon: "🔄" },
    { text: "50% Off", value: "Code: SCRATCH50", color: "#e74c3c", icon: "🔥" },
    { text: "Free Sample", value: "Choose any product", color: "#8e44ad", icon: "🎪" },
    { text: "VIP Access", value: "Exclusive member benefits", color: "#d35400", icon: "👑" },
    { text: "Free Shipping", value: "On orders over $25", color: "#3498db", icon: "🚚" },
  ],
  defaults: {
    cardWidth: 300,
    cardHeight: 200,
    scratchColor: "#c0c0c0",
    scratchPattern: "Scratch to reveal your prize!",
    revealThreshold: 60,
    title: "Scratch Card",
    resetButtonText: "Play Again",
    instructions: "Scratch the surface to reveal your prize!",
    variant: "default",
    size: "default",
  },
};

// AEM Content Fragment loader
export function loadAEMConfig<T extends BaseConfig>(contentFragmentPath: string, defaultConfig: T): Promise<T> {
  return new Promise((resolve) => {
    try {
      // In AEM, this would be replaced with actual content fragment API call
      // For now, we'll try to load from a JSON endpoint that AEM can serve
      fetch(`${contentFragmentPath}.json`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Failed to load config');
        })
        .then((config) => {
          resolve({ ...defaultConfig, ...config });
        })
        .catch((error) => {
          console.warn(`Failed to load AEM config from ${contentFragmentPath}, using defaults:`, error);
          resolve(defaultConfig);
        });
    } catch (error) {
      console.warn(`Failed to load AEM config from ${contentFragmentPath}, using defaults:`, error);
      resolve(defaultConfig);
    }
  });
}

// JSON file loader (for development/testing)
export function loadConfig<T extends BaseConfig>(configPath: string, defaultConfig: T): Promise<T> {
  return new Promise((resolve) => {
    try {
      fetch(configPath)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Failed to load config');
        })
        .then((config) => {
          resolve({ ...defaultConfig, ...config });
        })
        .catch((error) => {
          console.warn(`Failed to load config from ${configPath}, using defaults:`, error);
          resolve(defaultConfig);
        });
    } catch (error) {
      console.warn(`Failed to load config from ${configPath}, using defaults:`, error);
      resolve(defaultConfig);
    }
  });
}

// Synchronous configuration getter (for immediate use)
export function getConfig<T extends BaseConfig>(configPath: string, defaultConfig: T): T {
  // For immediate use, return default config
  // In AEM, this would be replaced with actual config loading
  return defaultConfig;
}

// AEM-specific configuration loader that can read from component properties
export function loadFromComponentProps<T extends BaseConfig>(props: any, defaultConfig: T): T {
  if (!props) return defaultConfig;
  
  try {
    // Parse segments/prizes from component properties
    const config = { ...defaultConfig } as T;
    
    if (props.segments && Array.isArray(props.segments)) {
      (config as any).segments = props.segments;
    }
    
    if (props.prizes && Array.isArray(props.prizes)) {
      (config as any).prizes = props.prizes;
    }
    
    // Override defaults with component properties
    if (props.title && config.defaults) config.defaults.title = props.title;
    if (props.buttonText && config.defaults) config.defaults.buttonText = props.buttonText;
    if (props.wheelSize && config.defaults) config.defaults.wheelSize = props.wheelSize;
    if (props.animationDuration && config.defaults) config.defaults.animationDuration = props.animationDuration;
    
    return config;
  } catch (error) {
    console.warn('Failed to parse component props, using defaults:', error);
    return defaultConfig;
  }
} 