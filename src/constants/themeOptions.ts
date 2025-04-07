// Define theme interface for better type safety
export interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor?: string;
  borderColor?: string;
  borderWidth?: number;
  headerColor?: string;
  headerHeight?: number;
  gradient?: string;
}

export const themeOptions: Theme[] = [
  { 
    name: "Pixel Light", 
    backgroundColor: "#f8f9fa", 
    textColor: "#202124",
    accentColor: "#1a73e8"
  },
  { 
    name: "Pixel Dark", 
    backgroundColor: "#202124", 
    textColor: "#e8eaed",
    accentColor: "#8ab4f8"
  },
  { 
    name: "VS Code Dark", 
    backgroundColor: "#1e1e1e", 
    textColor: "#d4d4d4",
    borderColor: "#007acc",
    borderWidth: 4
  },
  { 
    name: "LinkedIn", 
    backgroundColor: "#f3f2ef", 
    textColor: "#000000",
    headerColor: "#0a66c2",
    headerHeight: 40
  },
  { 
    name: "Twitter/X", 
    backgroundColor: "#000000", 
    textColor: "#ffffff",
    accentColor: "#1d9bf0"
  },
  { 
    name: "Instagram", 
    backgroundColor: "#ffffff", 
    textColor: "#262626",
    gradient: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
  }
];

// App UI theme colors (separate from caption themes)
export const appTheme = {
  light: {
    background: "#f8f9fa",
    cardBackground: "#ffffff",
    text: "#202124",
    border: "rgba(0, 0, 0, 0.1)",
    accent: "#1a73e8"
  },
  dark: {
    background: "#202124",
    cardBackground: "#303134",
    text: "#e8eaed",
    border: "rgba(255, 255, 255, 0.1)",
    accent: "#8ab4f8"
  }
};