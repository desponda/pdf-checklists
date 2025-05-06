import React from "react";
import { Tagline } from "./Header";

function Welcome() {
  return (
    <div className="w-full my-8">
      {/* Hero section with the hero image - blended into the design */}
      <div className="w-full overflow-hidden rounded-2xl shadow-lg border border-blue-900/40 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="p-4 md:p-6 relative">
          <img 
            src="/hero.png" 
            alt="PDF Checklists Hero" 
            className="w-full h-auto object-cover rounded-xl"
            style={{ maxHeight: '450px' }}
          />
          
          {/* Tagline positioned on the top-right of the hero image */}
          <div className="absolute top-12 right-12 max-w-xs">
            <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <span className="text-xl font-medium text-white">Your one stop for <span className="text-blue-400">flight checklists</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

