"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { registerServiceWorker } from './sw-register';
import SavedCaptions from '../components/SavedCaptions';

// Import types and constants from separate files
import { Caption } from '../types/caption';
import { fontOptions } from '../constants/fontOptions';
import { themeOptions } from '../constants/themeOptions';

// Add this import at the top
import CodePreview from "@/components/CodePreview";

export default function Home() {
  // State for caption input and styling
  const [captionText, setCaptionText] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#f8f9fa"); // Default to Pixel Light
  const [textColor, setTextColor] = useState("#202124");
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
  const [fontSize, setFontSize] = useState(32);
  const [selectedTheme, setSelectedTheme] = useState("Pixel Light");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State for saved captions
  const [savedCaptions, setSavedCaptions] = useState<Caption[]>([]);

  // Canvas reference for image generation
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to toggle dark mode
  // Function to toggle dark mode
  const toggleDarkMode = () => {
    // Check if we should use localStorage or prefer-color-scheme
    const isDarkOS = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  // Add this useEffect to initialize dark mode based on user preference
  useEffect(() => {
    // Check for saved theme preference or use OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  // Function to apply a theme
  const applyTheme = (themeName: string) => {
    const theme = themeOptions.find(t => t.name === themeName);
    if (theme) {
      setBackgroundColor(theme.backgroundColor);
      setTextColor(theme.textColor);
      setSelectedTheme(themeName);
    }
  };

  // Load saved captions from localStorage on component mount
  useEffect(() => {
    const loadedCaptions = localStorage.getItem("captions");
    if (loadedCaptions) {
      setSavedCaptions(JSON.parse(loadedCaptions));
    }
  }, []);

  // Save captions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("captions", JSON.stringify(savedCaptions));
  }, [savedCaptions]);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Function to save the current caption
  const saveCaption = () => {
    if (!captionText.trim()) return;

    const newCaption: Caption = {
      id: Date.now().toString(),
      text: captionText,
      backgroundColor,
      textColor,
      fontFamily,
      fontSize,
      createdAt: Date.now(),
      theme: selectedTheme
    };

    setSavedCaptions([newCaption, ...savedCaptions]);
    // Optional: Clear the input after saving
    // setCaptionText("");
  };

  // Function to load a saved caption
  const loadCaption = (caption: Caption) => {
    setCaptionText(caption.text);
    setBackgroundColor(caption.backgroundColor);
    setTextColor(caption.textColor);
    setFontFamily(caption.fontFamily);
    setFontSize(caption.fontSize);
    if (caption.theme) {
      setSelectedTheme(caption.theme);
    }
  };

  // Function to delete a saved caption
  const deleteCaption = (id: string) => {
    setSavedCaptions(savedCaptions.filter(caption => caption.id !== id));
  };

  // Function to clear all saved captions
  const clearAllCaptions = () => {
    if (confirm("Are you sure you want to clear all saved captions?")) {
      setSavedCaptions([]);
    }
  };

  // Function to generate and download the image
  const downloadImage = () => {
    if (!canvasRef.current || !captionText.trim()) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 1200;
    canvas.height = 630;

    // Get the selected theme
    const theme = themeOptions.find(t => t.name === selectedTheme) || themeOptions[0];

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply theme-specific styling
    if (theme.name === "Pixel Light" || theme.name === "Pixel Dark") {
      // Add Pixel-like status bar
      ctx.fillStyle = theme.name === "Pixel Dark" ? "#303134" : "#e8eaed";
      ctx.fillRect(0, 0, canvas.width, 40);

      // Add status bar icons and time
      ctx.fillStyle = theme.name === "Pixel Dark" ? "#9aa0a6" : "#5f6368";
      ctx.font = "16px Arial";
      ctx.textAlign = "right";

      // Time
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      ctx.fillText(time, canvas.width - 20, 25);

      // Battery icon
      ctx.fillRect(canvas.width - 60, 15, 25, 12);
      ctx.fillStyle = theme.name === "Pixel Dark" ? "#303134" : "#e8eaed";
      ctx.fillRect(canvas.width - 58, 17, 21, 8);
      ctx.fillStyle = theme.name === "Pixel Dark" ? "#9aa0a6" : "#5f6368";
      ctx.fillRect(canvas.width - 35, 18, 3, 6);

      // Draw a rounded rectangle for the content area
      const contentX = 20;
      const contentY = 60;
      const contentWidth = canvas.width - 40;
      const contentHeight = canvas.height - 80;
      const cornerRadius = 16;

      ctx.beginPath();
      ctx.moveTo(contentX + cornerRadius, contentY);
      ctx.lineTo(contentX + contentWidth - cornerRadius, contentY);
      ctx.quadraticCurveTo(contentX + contentWidth, contentY, contentX + contentWidth, contentY + cornerRadius);
      ctx.lineTo(contentX + contentWidth, contentY + contentHeight - cornerRadius);
      ctx.quadraticCurveTo(contentX + contentWidth, contentY + contentHeight, contentX + contentWidth - cornerRadius, contentY + contentHeight);
      ctx.lineTo(contentX + cornerRadius, contentY + contentHeight);
      ctx.quadraticCurveTo(contentX, contentY + contentHeight, contentX, contentY + contentHeight - cornerRadius);
      ctx.lineTo(contentX, contentY + cornerRadius);
      ctx.quadraticCurveTo(contentX, contentY, contentX + cornerRadius, contentY);
      ctx.closePath();

      // Fill with a slightly different shade for the content area
      ctx.fillStyle = theme.name === "Pixel Dark" ? "#303134" : "#ffffff";
      ctx.fill();

      // Add a small accent bar at the top
      ctx.fillStyle = theme.accentColor!;
      ctx.fillRect(contentX + contentWidth / 4, contentY, contentWidth / 2, 4);
    } else if (theme.name === "VS Code Dark") {
      // Add VS Code-like border
      ctx.strokeStyle = theme.borderColor!;
      ctx.lineWidth = theme.borderWidth!;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // Add VS Code-like title bar
      ctx.fillStyle = "#333333";
      ctx.fillRect(0, 0, canvas.width, 30);

      // Add window buttons
      ctx.fillStyle = "#ff5f56"; // Close button
      ctx.beginPath();
      ctx.arc(20, 15, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffbd2e"; // Minimize button
      ctx.beginPath();
      ctx.arc(40, 15, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#27c93f"; // Maximize button
      ctx.beginPath();
      ctx.arc(60, 15, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (theme.name === "LinkedIn") {
      // Add LinkedIn header
      ctx.fillStyle = theme.headerColor!;
      ctx.fillRect(0, 0, canvas.width, theme.headerHeight!);

      // Add LinkedIn logo
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "left";
      ctx.fillText("in", 20, 28);
    } else if (theme.name === "Twitter/X") {
      // Add Twitter/X logo
      ctx.fillStyle = theme.accentColor!;
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "left";
      ctx.fillText("𝕏", 20, 40);
    } else if (theme.name === "Instagram") {
      // Create Instagram-like gradient border
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#f09433");
      gradient.addColorStop(0.25, "#e6683c");
      gradient.addColorStop(0.5, "#dc2743");
      gradient.addColorStop(0.75, "#cc2366");
      gradient.addColorStop(1, "#bc1888");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    }

    // Draw text
    ctx.fillStyle = textColor;
    // Use the actual fontSize value directly (not scaled down)
    ctx.font = `${fontSize}px ${fontFamily.split(',')[0].replace(/["']/g, '')}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Handle text wrapping
    const maxWidth = canvas.width - 100;
    const lineHeight = fontSize * 1.2;
    const words = captionText.split(' ');
    let line = '';
    let lines = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Calculate starting Y position to center the text block
    // Adjust Y position based on theme
    let yOffset = 0;
    if (theme.name === "VS Code Dark") {
      yOffset = 30; // Account for title bar
    } else if (theme.name === "LinkedIn") {
      yOffset = theme.headerHeight!;
    }

    let y = ((canvas.height + yOffset) - (lines.length * lineHeight)) / 2;

    // Draw each line
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], canvas.width / 2, y + (i * lineHeight));
    }

    // Convert canvas to image and download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `caption-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className={`min-h-screen bg-[#f8f9fa] dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] transition-colors duration-200`}>
      <header className="p-4 border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#303134] shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-medium">CaptionSnap</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Caption input and styling */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-6 bg-white dark:bg-[#303134] rounded-xl shadow-sm">
            <div className="space-y-4">
              <label htmlFor="caption" className="block font-medium">
                Enter your caption
              </label>
              <textarea
                id="caption"
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
                className="w-full h-32 p-3 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#303134] text-[#202124] dark:text-[#e8eaed] focus:ring-2 focus:ring-[#1a73e8] dark:focus:ring-[#8ab4f8] focus:outline-none transition-shadow"
                placeholder="Type your caption here..."
              />
            </div>

            {/* Theme selector */}
            <div className="mt-6 space-y-4">
              <label htmlFor="theme" className="block font-medium">
                Select Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themeOptions.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => applyTheme(theme.name)}
                    className={`p-3 border border-black/10 dark:border-white/10 rounded-lg text-sm transition-all ${selectedTheme === theme.name
                      ? 'ring-2 ring-[#1a73e8] dark:ring-[#8ab4f8]'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    style={{
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor,
                    }}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#303134] rounded-xl shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="bgColor" className="block font-medium">
                  Background Color
                </label>
                <input
                  type="color"
                  id="bgColor"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="textColor" className="block font-medium">
                  Text Color
                </label>
                <input
                  type="color"
                  id="textColor"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fontFamily" className="block font-medium">
                  Font Family
                </label>
                <select
                  id="fontFamily"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-3 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#303134] text-[#202124] dark:text-[#e8eaed] focus:ring-2 focus:ring-[#1a73e8] dark:focus:ring-[#8ab4f8] focus:outline-none"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="fontSize" className="block font-medium">
                  Font Size
                </label>
                <input
                  type="range"
                  id="fontSize"
                  min="16"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-[#1a73e8] dark:accent-[#8ab4f8]"
                />
                <div className="text-sm text-center">{fontSize}px</div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={saveCaption}
                className="flex-1 px-4 py-3 bg-[#1a73e8] dark:bg-[#8ab4f8] text-white dark:text-[#202124] font-medium rounded-lg hover:bg-[#1765cc] dark:hover:bg-[#7aa5f8] transition-colors disabled:opacity-50"
                disabled={!captionText.trim()}
              >
                Save Caption
              </button>
              <button
                onClick={downloadImage}
                className="flex-1 px-4 py-3 bg-[#34a853] text-white font-medium rounded-lg hover:bg-[#2d9249] transition-colors disabled:opacity-50"
                disabled={!captionText.trim()}
              >
                Download Image
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-6 bg-white dark:bg-[#303134] rounded-xl shadow-sm">
            <h2 className="text-xl font-medium mb-4">Preview</h2>
            <div
              className="w-full aspect-[1200/630] rounded-xl overflow-hidden flex items-center justify-center p-4 text-center relative shadow-sm"
              style={{
                backgroundColor,
                color: textColor,
                fontFamily,
                fontSize: `${fontSize / 3}px`, // Scale down for preview only
              }}
            >
              {/* Theme-specific preview elements */}
              {selectedTheme.includes("Pixel") && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-[13px] bg-[#e8eaed] dark:bg-[#303134] flex justify-end items-center pr-2">
                    <span className="text-[8px] text-[#5f6368] dark:text-[#9aa0a6]">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="ml-1 w-[8px] h-[4px] rounded-sm bg-[#5f6368] dark:bg-[#9aa0a6]"></div>
                  </div>
                  <div
                    className="absolute top-[20px] left-[10%] right-[10%] bottom-[10px] rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: selectedTheme === "Pixel Dark" ? "#303134" : "#ffffff",
                      boxShadow: "0 2px 6px rgba(60, 64, 67, 0.15)"
                    }}
                  >
                    <div
                      className="absolute top-0 left-[25%] right-[25%] h-[2px]"
                      style={{
                        backgroundColor: selectedTheme === "Pixel Dark" ? "#8ab4f8" : "#1a73e8"
                      }}
                    ></div>
                    {captionText || "Your caption will appear here"}
                  </div>
                </>
              )}

              {selectedTheme === "VS Code Dark" && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-[10px] bg-[#333333] flex items-center">
                    <div className="ml-2 w-2 h-2 rounded-full bg-[#ff5f56]"></div>
                    <div className="ml-1 w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                    <div className="ml-1 w-2 h-2 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <div className="absolute top-0 left-0 right-0 bottom-0 border-[2px] border-[#007acc]"></div>
                </>
              )}
              {selectedTheme === "LinkedIn" && (
                <div className="absolute top-0 left-0 right-0 h-[13px] bg-[#0a66c2]">
                  <span className="text-white text-xs font-bold ml-2">in</span>
                </div>
              )}
              {selectedTheme === "Twitter/X" && (
                <div className="absolute top-2 left-2 text-[#1d9bf0] text-lg font-bold">𝕏</div>
              )}
              {selectedTheme === "Instagram" && (
                <div className="absolute top-0 left-0 right-0 bottom-0 border-[3px] border-[#e1306c]"></div>
              )}

              {/* Detect if the caption is code and use CodePreview if it is */}
              {isCode(captionText) ? (
                <CodePreview
                  code={captionText}
                  fontFamily={fontFamily}
                  fontSize={fontSize / 3} // Scale down for preview
                  textColor={textColor}
                  backgroundColor={backgroundColor}
                />
              ) : (
                captionText || "Your caption will appear here"
              )}
            </div>
          </div>

          {/* Hidden canvas for image generation */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Right column: Saved captions */}
        <div className="space-y-4">
          <SavedCaptions
            captions={savedCaptions}
            onLoad={loadCaption}
            onDelete={deleteCaption}
            onClearAll={clearAllCaptions}
          />
        </div>
      </main>
    </div>
  );
}

// Add this helper function to detect code
const isCode = (text: string): boolean => {
  // Simple heuristic: check for common code patterns
  const codePatterns = [
    /function\s+\w+\s*\(/,  // function declarations
    /const\s+\w+\s*=/,      // const declarations
    /let\s+\w+\s*=/,        // let declarations
    /var\s+\w+\s*=/,        // var declarations
    /class\s+\w+/,          // class declarations
    /import\s+.*from/,      // import statements
    /export\s+/,            // export statements
    /if\s*\(.+\)\s*{/,      // if statements
    /for\s*\(.+\)\s*{/,     // for loops
    /while\s*\(.+\)\s*{/,   // while loops
    /^\s*<.+>.*<\/.+>$/m,   // HTML/JSX tags
    /^\s*#include/m,        // C/C++ include
    /^\s*package\s+\w+;/m,  // Java package
    /^\s*import\s+[\w.]+;/m, // Java import
    /^\s*def\s+\w+\s*\(/m,  // Python function
    /^\s*@\w+/m,            // Python/Java decorators
  ];

  return codePatterns.some(pattern => pattern.test(text));
};
