import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-zinc-900/80 backdrop-blur-md border-b border-blue-900/30 shadow-xl transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-center py-4 px-6">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3">
          <a href="/" className="block"><img src="/logo.svg" alt="Logo" className="w-9 h-9" /></a>
          <span className="text-xl md:text-2xl font-bold text-white tracking-wide select-none">Flight <span className="text-blue-400">Simulation</span> Checklists</span>
          <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded ml-2">v1.0</span>
        </div>
      </div>
    </header>
  );
}
