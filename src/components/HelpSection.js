import React from 'react';

const HelpSection = () => {
  return (
    <div className="help-section">
      <h3>How to Use This Tool</h3>
      
      <div className="help-steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <strong>Select an Aircraft</strong>
            <p>Browse through the list of available aircraft and select the model you need a checklist for.</p>
          </div>
        </div>
        
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <strong>Choose a Variant</strong>
            <p>For most aircraft, you can choose between standard and dark mode checklists. Select your preferred style.</p>
          </div>
        </div>
        
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <strong>Generate PDF</strong>
            <p>Click the "Generate PDF Checklist" button to compile all pages into a single document.</p>
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
        <h4>Note</h4>
        <p>All checklist images are sourced from <a href="https://msfschecklist.de/ebag/" target="_blank" rel="noopener noreferrer">MSFS Checklist Database</a>. This tool simply combines the individual images into a convenient PDF format.</p>
      </div>
    </div>
  );
};

export default HelpSection;
