import { Moon, Sun } from 'lucide-react';

export default function ModeToggle({ preferDarkChecklist, onToggle }) {
  return (
    <div className="variant-toggle">
      <div className="variant-copy">
        <span className="variant-icon">{preferDarkChecklist ? <Moon size={17} /> : <Sun size={17} />}</span>
        <div><strong>Checklist format</strong><span>{preferDarkChecklist ? 'Dark cockpit-friendly pages' : 'Standard light pages'}</span></div>
      </div>
      <div className="variant-options" role="group" aria-label="Checklist format">
        <button type="button" className={`variant-option ${!preferDarkChecklist ? 'active' : ''}`} aria-pressed={!preferDarkChecklist} onClick={() => onToggle(false)}>
          <Sun size={14} /> Light
        </button>
        <button type="button" className={`variant-option ${preferDarkChecklist ? 'active' : ''}`} aria-pressed={preferDarkChecklist} onClick={() => onToggle(true)}>
          <Moon size={14} /> Dark
        </button>
      </div>
    </div>
  );
}
