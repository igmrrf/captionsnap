import { useState } from 'react';
import { Caption } from '../types/caption';

interface SavedCaptionsProps {
  captions: Caption[];
  onLoad: (caption: Caption) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function SavedCaptions({ captions, onLoad, onDelete, onClearAll }: SavedCaptionsProps) {
  return (
    <div className="p-6 bg-white dark:bg-[#303134] rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Saved Captions</h2>
        {captions.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-[#ea4335] hover:text-[#d33426] transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {captions.length === 0 ? (
        <p className="text-[#5f6368] dark:text-[#9aa0a6]">
          No saved captions yet. Save a caption to see it here.
        </p>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {captions.map((caption) => (
            <div
              key={caption.id}
              className="p-4 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div
                className="w-full h-16 mb-3 rounded-lg flex items-center justify-center overflow-hidden text-sm relative"
                style={{
                  backgroundColor: caption.backgroundColor,
                  color: caption.textColor,
                  fontFamily: caption.fontFamily,
                }}
              >
                {/* Theme-specific preview elements */}
                {caption.theme?.includes("Pixel") && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-[5px] bg-[#e8eaed] dark:bg-[#303134] flex justify-end items-center pr-1">
                      <span className="text-[6px] text-[#5f6368] dark:text-[#9aa0a6]">
                        12:34
                      </span>
                    </div>
                    <div 
                      className="absolute top-[7px] left-[10%] right-[10%] bottom-[2px] rounded-sm flex items-center justify-center"
                      style={{ 
                        backgroundColor: caption.theme === "Pixel Dark" ? "#303134" : "#ffffff",
                        boxShadow: "0 1px 2px rgba(60, 64, 67, 0.15)"
                      }}
                    >
                      <div 
                        className="absolute top-0 left-[25%] right-[25%] h-[1px]"
                        style={{ 
                          backgroundColor: caption.theme === "Pixel Dark" ? "#8ab4f8" : "#1a73e8" 
                        }}
                      ></div>
                    </div>
                  </>
                )}
                
                {caption.theme === "VS Code Dark" && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#333333] flex items-center">
                      <div className="ml-1 w-1 h-1 rounded-full bg-[#ff5f56]"></div>
                      <div className="ml-0.5 w-1 h-1 rounded-full bg-[#ffbd2e]"></div>
                      <div className="ml-0.5 w-1 h-1 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="absolute top-0 left-0 right-0 bottom-0 border-[1px] border-[#007acc]"></div>
                  </>
                )}
                
                {caption.theme === "LinkedIn" && (
                  <div className="absolute top-0 left-0 right-0 h-[5px] bg-[#0a66c2]">
                    <span className="text-white text-[6px] font-bold ml-1">in</span>
                  </div>
                )}
                
                {caption.theme === "Twitter/X" && (
                  <div className="absolute top-1 left-1 text-[#1d9bf0] text-[8px] font-bold">𝕏</div>
                )}
                
                {caption.theme === "Instagram" && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 border-[1px] border-[#e1306c]"></div>
                )}
                
                <span className="z-10">
                  {caption.text.length > 50
                    ? caption.text.substring(0, 50) + "..."
                    : caption.text}
                </span>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => onLoad(caption)}
                  className="text-sm text-[#1a73e8] dark:text-[#8ab4f8] hover:text-[#1765cc] dark:hover:text-[#7aa5f8] transition-colors"
                >
                  Load
                </button>
                <button
                  onClick={() => onDelete(caption.id)}
                  className="text-sm text-[#ea4335] hover:text-[#d33426] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}