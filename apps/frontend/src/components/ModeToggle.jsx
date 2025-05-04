import { Switch } from "@/components/ui/switch.jsx";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip.jsx";
import { Sun, Moon } from "lucide-react";

export default function ModeToggle({ preferDarkChecklist, onToggle }) {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center my-2 mb-8 p-4 bg-zinc-900 rounded-xl shadow-md border border-zinc-800 w-full max-w-md mx-auto">
        <div className="mb-2 flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggle(!preferDarkChecklist)}>
                <span className="text-xl">
                  {preferDarkChecklist ? <Moon className="text-blue-400" /> : <Sun className="text-yellow-400" />}
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
