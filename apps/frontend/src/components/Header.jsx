import React from "react";

function JetIcon({ className }) {
  // Simple, modern jet SVG icon
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 16l20-5-20-5v4l16 1-16 1z" />
      <line x1="22" y1="11" x2="22" y2="13" />
    </svg>
  );
}

export function Tagline() {
  return (
    <div className="flex justify-center my-8">
      <span className="relative inline-block px-8 py-2 text-zinc-100 text-lg md:text-xl font-light tracking-wide rounded-2xl" style={{ fontFamily: 'Inter, Roboto, Montserrat, Arial, sans-serif' }}>
        <span className="relative z-10">Your one stop shop for checklists</span>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect
            x="2" y="2" width="336" height="44" rx="22"
            stroke="#fff" strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="2" y="2" width="336" height="44" rx="22"
            stroke="url(#shiny)"
            strokeWidth="3"
            fill="none"
            style={{
              strokeDasharray: 760,
              strokeDashoffset: 0,
              animation: 'shinyTrace 2.5s linear infinite'
            }}
          />
          <defs>
            <linearGradient id="shiny" x1="0" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity="0" />
              <stop offset="0.2" stopColor="#fff" stopOpacity="0.7" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
              <stop offset="0.8" stopColor="#fff" stopOpacity="0.7" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <style>{`
          @keyframes shinyTrace {
            0% { stroke-dashoffset: 760; opacity: 0.7; }
            10% { opacity: 1; }
            60% { stroke-dashoffset: 0; opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 0; }
          }
        `}</style>
      </span>
    </div>
  );
}

export default function Header() {
  return (
    <>
      <header className="w-full flex justify-center mt-6 mb-4">
        <div className="backdrop-blur-md bg-zinc-900/95 border border-blue-900/40 shadow-3xl rounded-2xl w-full max-w-5xl mx-auto px-2 py-5 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <JetIcon className="text-blue-400" />
              <span className="text-xl md:text-2xl font-bold text-white tracking-wide">Flight Simulation Checklists</span>
              <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded ml-2">v1.0</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
