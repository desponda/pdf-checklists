import React, { useState } from 'react';

const HelpSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`help-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="help-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          <span className="help-icon">❓</span>
          How to Use This Tool
        </h3>
        <button className="help-toggle">
          {isExpanded ? '▲ Hide Help' : '▼ Show Help'}
        </button>
      </div>
      
      <div className="help-content">
        <div className="help-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Select an Aircraft</strong>
              <p>Browse through the list of available aircraft and select the model you need a checklist for. You can filter by category or use the search box to find specific aircraft.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>Choose a Variant</strong>
              <p>For most aircraft, you can choose between standard and dark mode checklists. The dark mode variants are optimized for night flying or low-light conditions.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>Generate PDF</strong>
              <p>Click the "Generate PDF Checklist" button to compile all pages into a single document. The generation may take a few moments depending on the size of the checklist.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>Download</strong>
              <p>Your PDF will automatically download once generated. It's ready to print or save for future use.</p>
            </div>
          </div>
        </div>
        
        <div className="help-note">
          <h4>Tips</h4>
          <ul className="tips-list">
            <li>Use the <strong>category filter</strong> to narrow down aircraft by type (Airliners, General Aviation, Military, etc.)</li>
            <li>Check the <strong>"Dark mode only"</strong> option if you prefer night-optimized checklists</li>
            <li>Each aircraft card shows the total number of pages that will be included in your PDF</li>
          </ul>
          
          <h4>Attribution</h4>
          <p>All checklist images are sourced from <a href="https://msfschecklist.de/ebag/" target="_blank" rel="noopener noreferrer">MSFS Checklist Database</a>. This tool simply combines the individual images into a convenient PDF format.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
