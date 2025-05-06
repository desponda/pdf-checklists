import { Card, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { CheckCircle2, Loader2, Search } from "lucide-react";
import { useState, useMemo } from "react";

// Map of backend category names to display names
const CATEGORY_MAP = {
  "airliner": "Airliners",
  "general_aviation": "General Aviation",
  "helicopter": "Helicopters",
  "military": "Military",
  "wip": "Work in Progress"
};

// Aircraft card component to simplify the main component
function AircraftCard({ 
  id, 
  aircraft, 
  isSelected, 
  generatingPDF, 
  preferDarkChecklist, 
  onSelect, 
  onGenerate 
}) {
  // Determine which variant to use based on preferences
  const variant = useMemo(() => {
    if (preferDarkChecklist) {
      const darkKey = Object.keys(aircraft.variants || {}).find(v => 
        v.toLowerCase().includes('dark')
      );
      if (darkKey) return { type: darkKey };
    } else if (aircraft.standard) {
      return { type: 'standard' };
    }
    return null;
  }, [aircraft, preferDarkChecklist]);

  // If no suitable variant, don't render
  if (!variant) return null;

  const showSpinner = generatingPDF && isSelected;
  const name = aircraft.standard?.name || id;

  return (
    <Card
      key={id}
      onClick={() => {
        if (!generatingPDF) {
          onSelect(id, variant.type);
          onGenerate(id, variant.type);
        }
      }}
      className={`relative transition-all border-2 cursor-pointer select-none 
        ${isSelected 
          ? 'border-blue-500 bg-blue-950/40 shadow-xl ring-2 ring-blue-400' 
          : 'border-zinc-800 bg-zinc-900 hover:border-blue-400 hover:bg-zinc-900/80 hover:shadow-lg hover:scale-[1.025]'}
        ${generatingPDF && !isSelected ? 'opacity-60 pointer-events-none' : ''}`}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      style={{ transition: 'box-shadow 0.2s, transform 0.2s' }}
    >
      {/* Overlay for spinner when generating PDF */}
      {showSpinner && (
        <div className="absolute inset-0 bg-zinc-950/70 flex flex-col items-center justify-center z-10 rounded-xl">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
          <span className="text-xs text-zinc-200">Generating PDF...</span>
        </div>
      )}
      
      {/* Animated checkmark for selection */}
      <span 
        className={`absolute top-3 right-3 text-blue-400 z-10 transition-all duration-300 
          ${isSelected && !generatingPDF 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-2 scale-75 pointer-events-none'}`}
      >
        <CheckCircle2 className="w-6 h-6" />
      </span>
      
      <CardHeader>
        <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
          {name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function AircraftSelector({ 
  aircraftData, 
  selectedAircraft, 
  onSelect, 
  onGenerate, 
  preferDarkChecklist, 
  generatingPDF 
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Aircraft");

  // Get available categories from the aircraft data
  const categories = useMemo(() => {
    // Collect unique categories from the data
    const uniqueCategories = new Set();
    
    Object.values(aircraftData).forEach(aircraft => {
      if (aircraft.category) {
        uniqueCategories.add(aircraft.category);
      }
    });
    
    // Map to display names and sort
    const displayCategories = Array.from(uniqueCategories)
      .map(cat => CATEGORY_MAP[cat] || cat)
      .sort();
    
    return ["All Aircraft", ...displayCategories];
  }, [aircraftData]);

  // Filter aircraft based on search and category
  const filteredAircraft = useMemo(() => {
    return Object.entries(aircraftData)
      .filter(([id, aircraft]) => {
        const name = aircraft.standard?.name || id;
        
        // Apply search filter
        if (search && !name.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        
        // Apply category filter
        if (category !== "All Aircraft") {
          // Get display name for this aircraft's category
          const displayCategory = CATEGORY_MAP[aircraft.category] || aircraft.category;
          
          if (category !== displayCategory) {
            return false;
          }
        }
        
        return true;
      });
  }, [aircraftData, search, category]);

  return (
    <div className="w-full">
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            placeholder="Search aircraft..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 max-w-xs w-full bg-zinc-800/80 border-zinc-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-zinc-200 placeholder-zinc-400"
            aria-label="Search aircraft"
          />
        </div>
        
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="max-w-xs bg-zinc-800/80 border-zinc-700 text-zinc-200 rounded px-3 py-2 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          aria-label="Filter by aircraft category"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <span className="text-zinc-400 text-sm ml-auto">
          Showing <span className="text-blue-400 font-medium">{filteredAircraft.length}</span> of <span className="text-blue-400 font-medium">{Object.keys(aircraftData).length}</span> aircraft
        </span>
      </div>
      
      {/* Aircraft grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredAircraft.map(([id, aircraft]) => (
          <AircraftCard
            key={id}
            id={id}
            aircraft={aircraft}
            isSelected={selectedAircraft === id}
            generatingPDF={generatingPDF}
            preferDarkChecklist={preferDarkChecklist}
            onSelect={onSelect}
            onGenerate={onGenerate}
          />
        ))}
        
        {filteredAircraft.length === 0 && (
          <div className="col-span-3 py-12 text-center">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-400 mb-2">No aircraft found matching your search criteria.</p>
              <p className="text-zinc-500 text-sm">Try adjusting your search or category filter.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
