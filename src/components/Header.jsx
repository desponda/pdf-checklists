import { Switch } from "@/components/ui/switch.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function Header({ preferDarkMode, onToggle }) {
  return (
    <header className="w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 shadow-lg border-b border-zinc-800 py-4 px-2">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white tracking-wide">✈️ Aircraft Checklist PDF Generator</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-300 text-sm mr-2">{preferDarkMode ? 'Dark' : 'Light'} Mode</span>
          <Switch checked={preferDarkMode} onCheckedChange={onToggle} />
        </div>
      </div>
    </header>
  );
}
