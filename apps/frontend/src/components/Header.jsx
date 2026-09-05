import React from 'react';
import { Radio } from 'lucide-react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="/" className="brand" aria-label="Flight Simulation Checklists home">
          <img src="/logo.svg" alt="" className="brand-mark" />
          <span className="brand-name">Flight <span className="text-blue-400">Simulation</span> Checklists</span>
        </a>
        <div className="header-meta">
          <span className="live-pill"><Radio size={12} /> Catalog online</span>
          <span className="version-badge text-blue-300">v1.0</span>
        </div>
      </div>
    </header>
  );
}
