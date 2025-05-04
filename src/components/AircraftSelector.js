import React, { useState } from 'react';

const AircraftSelector = ({ aircraftData, selectedAircraft, selectedVariant, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDarkOnly, setShowDarkOnly] = useState(false);

  // Filter aircraft based on search query and dark mode filter
  const filteredAircraftIds = Object.keys(aircraftData).filter(aircraftId => {
    const matchesSearch = aircraftId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by dark mode if enabled
    if (showDarkOnly) {
      const aircraft = aircraftData[aircraftId];
      const hasDarkVariant = Object.keys(aircraft.variants || {}).some(variant => 
        variant.toLowerCase().includes('dark')
      );
      return matchesSearch && hasDarkVariant;
    }
    
    return matchesSearch;
  });

  return (
    <>
      <div className="filter-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search aircraft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search" 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        
        <div className="filter-options">
          <label className="filter-checkbox">
            <input 
              type="checkbox" 
              checked={showDarkOnly} 
              onChange={() => setShowDarkOnly(!showDarkOnly)} 
            />
            <span>Show only aircraft with dark mode</span>
          </label>
        </div>
        
        <div className="results-count">
          Showing {filteredAircraftIds.length} of {Object.keys(aircraftData).length} aircraft
        </div>
      </div>
      
      <div className="aircraft-grid">
        {filteredAircraftIds.length === 0 ? (
          <div className="no-results">
            <p>No aircraft match your search criteria</p>
            <button onClick={() => { setSearchQuery(''); setShowDarkOnly(false); }}>
              Clear filters
            </button>
          </div>
        ) : (
          filteredAircraftIds.map((aircraftId) => {
            const aircraft = aircraftData[aircraftId];
            const hasStandard = aircraft.standard !== undefined;
            const hasVariants = Object.keys(aircraft.variants || {}).length > 0;
            const totalPages = 
              (hasStandard ? aircraft.standard.pages.length : 0) + 
              Object.values(aircraft.variants || {}).reduce((sum, variant) => sum + variant.pages.length, 0);
            
            return (
              <div 
                key={aircraftId}
                className={`aircraft-card ${selectedAircraft === aircraftId ? 'selected' : ''}`}
              >
                <div className="aircraft-header">
                  <h3 className="aircraft-title">{aircraftId}</h3>
                  <div className="aircraft-meta">
                    <span className="total-pages">{totalPages} pages total</span>
                    {Object.keys(aircraft.variants || {}).some(v => v.toLowerCase().includes('dark')) && (
                      <span className="dark-badge">Dark Mode</span>
                    )}
                  </div>
                </div>
                
                <div className="aircraft-body">
                  {hasStandard && (
                    <div className="variant-option">
                      <input 
                        type="radio"
                        id={`${aircraftId}-standard`}
                        name="aircraft-variant"
                        className="variant-radio"
                        checked={selectedAircraft === aircraftId && selectedVariant === 'standard'}
                        onChange={() => onSelect(aircraftId, 'standard')}
                      />
                      <label htmlFor={`${aircraftId}-standard`} className="variant-label">
                        Standard
                        <div className="pages-info">
                          {aircraft.standard.pages.length} pages
                        </div>
                      </label>
                    </div>
                  )}
                  
                  {hasVariants && Object.keys(aircraft.variants).map((variantId) => {
                    const variant = aircraft.variants[variantId];
                    return (
                      <div className="variant-option" key={`${aircraftId}-${variantId}`}>
                        <input 
                          type="radio"
                          id={`${aircraftId}-${variantId}`}
                          name="aircraft-variant"
                          className="variant-radio"
                          checked={selectedAircraft === aircraftId && selectedVariant === variantId}
                          onChange={() => onSelect(aircraftId, variantId)}
                        />
                        <label htmlFor={`${aircraftId}-${variantId}`} className="variant-label">
                          {variantId}
                          <div className="pages-info">
                            {variant.pages.length} pages
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default AircraftSelector;
