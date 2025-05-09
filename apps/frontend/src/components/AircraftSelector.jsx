import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { CheckCircle2, Loader2, Search, Download } from "lucide-react";
import { useState, useMemo } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip.jsx";
import { IoMdAirplane } from "react-icons/io";
import { GiAirplane } from "react-icons/gi";
import { FaHelicopter, FaFighterJet, FaWrench } from "react-icons/fa";

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
  const category = aircraft.category ? (aircraft.category[0].toUpperCase() + aircraft.category.slice(1).replace('_', ' ')) : '';
  const displayCategory = {
    "airliner": "Airliners",
    "general_aviation": "General Aviation",
    "helicopter": "Helicopters",
    "military": "Military",
    "wip": "Work in Progress"
  }[aircraft.category] || category;
  const Icon = CATEGORY_ICONS[displayCategory] || IoMdAirplane;

  // Ripple animation for download icon
  function handleDownload(e) {
    e.stopPropagation();
    if (!generatingPDF) onGenerate(id, variant.type);
    // Ripple effect
    const icon = e.currentTarget;
    icon.classList.remove('animate-ping');
    void icon.offsetWidth; // trigger reflow
    icon.classList.add('animate-ping');
    setTimeout(() => icon.classList.remove('animate-ping'), 400);
  }

  return (
    <TooltipProvider>
      <Card
        key={id}
        className={`relative transition-all border-2 cursor-pointer select-none glass-card group
          ${isSelected 
            ? 'border-violet-400/60 bg-gradient-to-br from-indigo-700/60 via-blue-800/40 to-violet-700/40 shadow-2xl ring-2 ring-violet-300/60' 
            : 'border-violet-400/20 bg-gradient-to-br from-indigo-700/40 via-blue-800/30 to-violet-700/30 hover:border-violet-300/40 hover:shadow-2xl hover:scale-[1.045] hover:shadow-violet-400/30'}
          ${generatingPDF && !isSelected ? 'opacity-60 pointer-events-none' : ''}`}
        style={{backdropFilter:'blur(24px) saturate(140%)', WebkitBackdropFilter:'blur(24px) saturate(140%)', borderRadius:'1.5rem', boxShadow:'0 12px 48px 0 rgba(139,92,246,0.13), 0 2px 8px 0 rgba(139,92,246,0.10)', transition:'box-shadow 0.2s, transform 0.2s'}} 
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
        onClick={() => {
          if (!generatingPDF) {
            onSelect(id, variant.type);
            onGenerate(id, variant.type);
          }
        }}
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
          className={`absolute top-3 right-3 text-violet-400 z-10 transition-all duration-300 
            ${isSelected && !generatingPDF 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-2 scale-75 pointer-events-none'}`}
        >
          <CheckCircle2 className="w-6 h-6" />
        </span>
        {/* Download icon with tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="absolute top-3 left-3 z-20 cursor-pointer rounded-full p-1 bg-violet-700/20 hover:bg-violet-500/30 transition group-hover:scale-110 group-hover:shadow-violet-400/30 group-hover:shadow-lg"
              onClick={handleDownload}
              tabIndex={0}
              aria-label={`Download checklist for ${name}`}
            >
              <Download className="w-6 h-6 text-violet-200 group-hover:text-white transition-all duration-200" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">Download PDF</TooltipContent>
        </Tooltip>
        {/* Aviation icon with animation */}
        <div className="flex justify-center items-center w-14 h-14 rounded-full bg-violet-900/30 mx-auto mt-8 mb-2 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110 group-hover:shadow-violet-400/30 group-hover:shadow-lg">
          <Icon className="w-8 h-8 text-violet-300 group-hover:animate-bounce" />
        </div>
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-lg text-zinc-100 font-semibold text-center flex items-center gap-2 mb-1">
            {name}
          </CardTitle>
          <CardDescription className="text-xs text-violet-200 font-medium mb-2 text-center">
            {displayCategory}
          </CardDescription>
        </CardHeader>
      </Card>
    </TooltipProvider>
  );
}

const CATEGORY_ICONS = {
  "Airliners": (props) => <IoMdAirplane {...props} />,
  "General Aviation": (props) => <GiAirplane {...props} />,
  "Helicopters": (props) => <FaHelicopter {...props} />,
  "Military": (props) => <FaFighterJet {...props} />,
  "Work in Progress": (props) => <FaWrench {...props} />,
};

export default function AircraftSelector({ 
  aircraftData, 
  selectedAircraft, 
  onSelect, 
  onGenerate, 
  preferDarkChecklist, 
  generatingPDF, 
  loading = false // add loading prop for skeletons
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
      .map(cat => {
        const displayCat = {
          "airliner": "Airliners",
          "general_aviation": "General Aviation",
          "helicopter": "Helicopters",
          "military": "Military",
          "wip": "Work in Progress"
        }[cat] || cat;
        return displayCat;
      })
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
          const displayCategory = {
            "airliner": "Airliners",
            "general_aviation": "General Aviation",
            "helicopter": "Helicopters",
            "military": "Military",
            "wip": "Work in Progress"
          }[aircraft.category] || aircraft.category;
          if (category !== displayCategory) {
            return false;
          }
        }
        // Only include aircraft with a valid variant
        const hasVariant = (() => {
          if (preferDarkChecklist) {
            const darkKey = Object.keys(aircraft.variants || {}).find(v =>
              v.toLowerCase().includes('dark')
            );
            if (darkKey) return true;
          }
          if (aircraft.standard) return true;
          return false;
        })();
        if (!hasVariant) return false;
        return true;
      });
  }, [aircraftData, search, category, preferDarkChecklist]);

  return (
    <div className="w-full">
      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        {/* Pill-shaped search bar with icon and clear button */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            placeholder="Search aircraft..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-10 max-w-xs w-full bg-zinc-800/80 border-zinc-700 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-zinc-200 placeholder-zinc-400 rounded-full shadow"
            aria-label="Search aircraft"
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-blue-400 transition"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              tabIndex={0}
            >
              ×
            </button>
          )}
        </div>
        {/* Filter chips for categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-4 py-1 rounded-full border text-sm font-medium transition shadow-sm
                ${category === cat
                  ? 'bg-blue-500 text-white border-blue-500 shadow'
                  : 'bg-zinc-800/80 text-zinc-200 border-zinc-700 hover:bg-blue-900/40 hover:text-blue-300'}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-zinc-400 text-sm ml-auto">
          Showing <span className="text-blue-400 font-medium">{filteredAircraft.length}</span> of <span className="text-blue-400 font-medium">{Object.keys(aircraftData).length}</span> aircraft
        </span>
      </div>
      {/* Aircraft grid or loading skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card h-40 animate-pulse bg-zinc-800/60 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
            <div className="col-span-3 py-12 text-center flex flex-col items-center">
              <span className="text-5xl mb-4">🛩️</span>
              <p className="text-zinc-400 mb-2">No aircraft found matching your search.</p>
              <p className="text-zinc-500 text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
