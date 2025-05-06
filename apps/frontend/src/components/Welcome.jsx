import React from "react";

function Welcome() {
  return (
    <div className="w-full my-8">
      {/* Hero section with the hero image - blended into the design */}
      <div className="w-full overflow-hidden rounded-2xl shadow-lg border border-zinc-800/50 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="p-4 md:p-6">
          <img 
            src="/hero.png" 
            alt="PDF Checklists Hero" 
            className="w-full h-auto object-cover rounded-xl"
            style={{ maxHeight: '450px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Welcome;

