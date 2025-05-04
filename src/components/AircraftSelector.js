import React, { useState, useMemo } from 'react';

const AircraftSelector = ({ aircraftData, selectedAircraft, selectedVariant, onSelect, preferDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Define aircraft categories
  const aircraftCategories = useMemo(() => {
    return {
      'all': 'All Aircraft',
      'airliner': 'Airliners',
      'general': 'General Aviation',
      'military': 'Military',
      'helicopter': 'Helicopters',
      'other': 'Other Aircraft'
    };
  }, []);
  
  // Categorize aircraft
  const categorizedAircraft = useMemo(() => {
    const categorized = {
      'airliner': [],
      'general': [],
      'military': [],
      'helicopter': [],
      'other': []
    };
    
    Object.keys(aircraftData).forEach(aircraftId => {
      // Simple categorization based on aircraft ID
      if (/^A[0-9]|^B[0-9]|^EMB|^CRJ|^MD|Concorde|Fokker|ATR/.test(aircraftId)) {
        categorized.airliner.push(aircraftId);
      } else if (/Cessna|Piper|Beech|Mooney|Baron|Bonanza|DA_|Pilatus|TBM|Phenom|Citation|Kodiak|Learjet|King_Air|DHC/.test(aircraftId)) {
        categorized.general.push(aircraftId);
      } else if (/F_|F[0-9]|FA_|Spitfire|Tornado|C_17|T_|Eurofighter|Hawk|Vulcan/.test(aircraftId)) {
        categorized.military.push(aircraftId);
      } else if (/Bell|H135|H145|Huey|Osprey/.test(aircraftId)) {
        categorized.helicopter.push(aircraftId);
      } else {
        categorized.other.push(aircraftId);
      }
    });
    
    return categorized;
  }, [aircraftData]);
  
  // Filter aircraft based on search query, category, and considering dark mode preferences
  const filteredAircraftIds = useMemo(() => {
    // First filter by search and category
    let filteredIds = Object.keys(aircraftData).filter(aircraftId => {
      return aircraftId.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    // Filter by category if not "all"
    if (selectedCategory !== 'all') {
      filteredIds = filteredIds.filter(id => categorizedAircraft[selectedCategory].includes(id));
    }
    
    return filteredIds;
  }, [aircraftData, searchQuery, selectedCategory, categorizedAircraft]);

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
        
        <div className="category-filter">
          <label htmlFor="category-select">Category:</label>
          <select 
            id="category-select" 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {Object.entries(aircraftCategories).map(([value, label]) => (
              <option key={value} value={value}>
                {label} {value !== 'all' && `(${categorizedAircraft[value].length})`}
              </option>
            ))}
          </select>
        </div>
        
        <div className="results-count">
          Showing {filteredAircraftIds.length} of {Object.keys(aircraftData).length} aircraft
          {preferDarkMode && <span className="dark-mode-indicator"> (Dark mode preferred)</span>}
        </div>
      </div>
      
      <div className="aircraft-grid">
        {filteredAircraftIds.length === 0 ? (
          <div className="no-results">
            <p>No aircraft match your search criteria</p>
            <button onClick={() => setSearchQuery('')}>
              Clear filters
            </button>
          </div>
        ) : (
          filteredAircraftIds
            .map((aircraftId) => {
            const aircraft = aircraftData[aircraftId];
            const hasStandard = aircraft.standard !== undefined;
            const hasVariants = Object.keys(aircraft.variants || {}).length > 0;
            const hasDarkVariant = hasVariants && Object.keys(aircraft.variants).some(v => 
              v.toLowerCase().includes('dark')
            );
            
            // Determine which variants to show based on mode preference
            let showStandard = hasStandard && (!preferDarkMode || !hasDarkVariant);
            let variantsToShow = Object.keys(aircraft.variants || {}).filter(variant => {
              const isDarkVariant = variant.toLowerCase().includes('dark');
              return preferDarkMode ? isDarkVariant : !isDarkVariant;
            });
            
            // Count total pages for visible variants
            const totalPages = 
              (showStandard ? aircraft.standard.pages.length : 0) + 
              variantsToShow.reduce((sum, variantId) => sum + aircraft.variants[variantId].pages.length, 0);
            
            // Skip aircraft that have no visible variants after filtering
            if (!showStandard && variantsToShow.length === 0) return null;
            
            return (
              <div 
                key={aircraftId}
                className={`aircraft-card ${selectedAircraft === aircraftId ? 'selected' : ''}`}
              >
                <div className="aircraft-header">
                  <h3 className="aircraft-title">{aircraftId}</h3>
                  <div className="aircraft-meta">
                    <span className="total-pages">{totalPages} pages</span>
                  </div>
                </div>
                
                <div className="aircraft-body">
                  {showStandard && (
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
                  
                  {variantsToShow.map((variantId) => {
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
          // Filter out null values (aircraft with no visible variants)
          .filter(card => card !== null)
        )}
      </div>
    </>
  );
};

export default AircraftSelector;
