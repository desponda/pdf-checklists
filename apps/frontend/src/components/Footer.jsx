import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-title">Flight Simulation Checklists</div>
          <p>Useful pre-flight references for sim pilots.</p>
        </div>
        <nav className="footer-links" aria-label="Footer links">
          <a href="https://msfschecklist.de" target="_blank" rel="noopener noreferrer">Source index <ExternalLink size={14} /></a>
          <a href="https://github.com/desponda/pdf-checklists" target="_blank" rel="noopener noreferrer"><Github size={14} /> GitHub</a>
        </nav>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} PDF Checklist Generator</span><span>Made for the long haul.</span></div>
    </footer>
  );
}
