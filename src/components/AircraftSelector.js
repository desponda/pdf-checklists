import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

const SearchBar = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.surface.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.text.main};
  font-size: ${({ theme }) => theme.typography.text.regular};
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.text.large};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: 50%;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.main};
    background: ${({ theme }) => theme.colors.surface.muted};
  }
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.text.main};
  font-size: ${({ theme }) => theme.typography.text.regular};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const ResultsCount = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.text.small};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const AircraftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const AircraftCard = styled.div`
  background: ${({ theme }) => theme.colors.surface.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  ${({ isSelected, theme }) => isSelected && `
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
  `}
`;

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
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Search aircraft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <ClearButton
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </ClearButton>
          )}
        </SearchBar>

        <div className="category-filter">
          <label htmlFor="category-select">Category:</label>
          <CategorySelect
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {Object.entries(aircraftCategories).map(([value, label]) => (
              <option key={value} value={value}>
                {label} {value !== 'all' && `(${categorizedAircraft[value].length})`}
              </option>
            ))}
          </CategorySelect>
        </div>

        <ResultsCount>
          Showing {filteredAircraftIds.length} of {Object.keys(aircraftData).length} aircraft
          {preferDarkMode && <span className="dark-mode-indicator"> (Dark mode preferred)</span>}
        </ResultsCount>
      </div>

      <AircraftGrid>
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
                <AircraftCard
                  key={aircraftId}
                  isSelected={selectedAircraft === aircraftId}
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
                </AircraftCard>
              );
            })
            // Filter out null values (aircraft with no visible variants)
            .filter(card => card !== null)
        )}
      </AircraftGrid>
    </>
  );
};

export default AircraftSelector;
