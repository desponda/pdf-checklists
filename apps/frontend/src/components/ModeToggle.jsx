import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch.jsx';

export default function ModeToggle({ preferDarkChecklist, onToggle }) {
  return (
    <div className="variant-toggle">
      <div className="variant-copy">
        <span className="variant-icon">{preferDarkChecklist ? <Moon size={17} /> : <Sun size={17} />}</span>
        <div><strong>Checklist format</strong><span>{preferDarkChecklist ? 'Dark cockpit-friendly pages' : 'Standard light pages'}</span></div>
      </div>
      <Switch checked={preferDarkChecklist} onCheckedChange={onToggle} id="checklist-variant-toggle" aria-label="Toggle dark checklist variants" />
    </div>
  );
}
