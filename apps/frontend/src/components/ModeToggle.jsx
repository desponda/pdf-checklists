import { Switch } from "@/components/ui/switch.jsx";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip.jsx";

function SunMoonIcon({ dark }) {
  // Morphing SVG sun/moon
  return (
    <span className="inline-block w-6 h-6 transition-colors duration-300">
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          {/* Sun rays (fade out in dark mode) */}
          <g style={{ opacity: dark ? 0 : 1, transition: 'opacity 0.3s' }}>
            <circle cx="12" cy="12" r="5" fill="#facc15" />
            <g stroke="#facc15" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </g>
          {/* Moon (fade in in dark mode) */}
          <g style={{ opacity: dark ? 1 : 0, transition: 'opacity 0.3s' }}>
            <path
              d="M17 12.5A5.5 5.5 0 0 1 11.5 7c0-1.38.56-2.63 1.47-3.54A8 8 0 1 0 21 15.03c-.91.91-2.16 1.47-3.54 1.47z"
              fill="#60a5fa"
            />
          </g>
        </g>
      </svg>
    </span>
  );
}

export default function ModeToggle({ preferDarkChecklist, onToggle }) {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center my-2 mb-8 p-4 bg-zinc-900 rounded-xl shadow-md border border-zinc-800 w-full max-w-md mx-auto">
        <div className="mb-2 flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggle(!preferDarkChecklist)}>
                <span className="text-xl transition-transform duration-300">
                  <SunMoonIcon dark={preferDarkChecklist} />
                </span>
                <Switch checked={preferDarkChecklist} onCheckedChange={onToggle} id="checklist-variant-toggle" />
                <label htmlFor="checklist-variant-toggle" className="font-medium text-base text-zinc-200 cursor-pointer select-none">
                  {preferDarkChecklist ? 'Dark Checklists' : 'Light Checklists'}
                </label>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              {preferDarkChecklist
                ? 'Switch to light/standard variants of checklists (if available)'
                : 'Switch to dark variants of checklists (if available)'}
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="text-xs text-zinc-400 block mt-1 text-center">
          {preferDarkChecklist
            ? 'You will see dark variants of checklists (if available)'
            : 'You will see light/standard variants of checklists (if available)'}
        </span>
      </div>
    </TooltipProvider>
  );
}
