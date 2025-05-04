import { Switch } from "@/components/ui/switch.jsx";

export default function ModeToggle({ preferDarkChecklist, onToggle }) {
  return (
    <div className="flex flex-col items-center my-2 mb-8 p-4 bg-zinc-900 rounded-xl shadow-md border border-zinc-800 w-full max-w-md mx-auto">
      <div className="mb-2 flex items-center gap-3">
        <Switch checked={preferDarkChecklist} onCheckedChange={onToggle} id="checklist-variant-toggle" />
        <label htmlFor="checklist-variant-toggle" className="font-medium text-base text-zinc-200 cursor-pointer">
          {preferDarkChecklist ? 'Show Dark Checklists' : 'Show Light Checklists'}
        </label>
      </div>
      <span className="text-xs text-zinc-400 block mt-1 text-center">
        {preferDarkChecklist
          ? 'You will see dark variants of checklists (if available)'
          : 'You will see light/standard variants of checklists (if available)'}
      </span>
    </div>
  );
}
