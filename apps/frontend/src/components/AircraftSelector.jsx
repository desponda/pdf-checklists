import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";

export default function AircraftSelector({ aircraftData, selectedAircraft, selectedVariant, onSelect, onGenerate, preferDarkChecklist, generatingPDF }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Aircraft");

  const categories = useMemo(() => {
    const cats = new Set();
    Object.values(aircraftData).forEach((a) => {
      if (a.standard && a.standard.name) {
        cats.add("General Aviation");
      }
      if (a.variants) {
        Object.keys(a.variants).forEach((v) => {
          if (v.toLowerCase().includes("dark")) cats.add("Dark Variants");
        });
      }
    });
    return ["All Aircraft", ...Array.from(cats)];
  }, [aircraftData]);

  const filteredAircraft = useMemo(() => {
    return Object.entries(aircraftData)
      .filter(([id, a]) => {
        const name = a.standard?.name || id;
        if (search && !name.toLowerCase().includes(search.toLowerCase())) return false;
        if (category !== "All Aircraft") {
          if (category === "General Aviation" && !(a.standard && a.standard.name)) return false;
          if (category === "Dark Variants" && !Object.keys(a.variants || {}).some(v => v.toLowerCase().includes("dark"))) return false;
        }
        return true;
      });
  }, [aircraftData, search, category]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <Input
          placeholder="Search aircraft..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs bg-zinc-800 border-zinc-700 text-zinc-200 placeholder-zinc-400"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="max-w-xs bg-zinc-800 border-zinc-700 text-zinc-200 rounded px-3 py-2"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <span className="text-zinc-400 text-sm ml-auto">Showing {filteredAircraft.length} of {Object.keys(aircraftData).length} aircraft</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredAircraft.map(([id, a]) => {
          const isSelected = selectedAircraft === id;
          let variant = null;
          if (preferDarkChecklist) {
            const darkKey = Object.keys(a.variants || {}).find(v => v.toLowerCase().includes('dark'));
            if (darkKey) {
              variant = { type: darkKey };
            }
          } else {
            if (a.standard) {
              variant = { type: 'standard' };
            }
          }
          if (!variant) return null;
          const showSpinner = generatingPDF && isSelected;
          return (
            <Card
              key={id}
              onClick={() => {
                if (!generatingPDF) {
                  onSelect(id, variant.type);
                  onGenerate(id, variant.type);
                }
              }}
              className={`relative transition-all border-2 cursor-pointer select-none ${isSelected ? 'border-blue-500 bg-blue-950/40 shadow-xl ring-2 ring-blue-400' : 'border-zinc-800 bg-zinc-900 hover:border-blue-400 hover:bg-zinc-900/80 hover:shadow-lg hover:scale-[1.025]'} ${generatingPDF && !isSelected ? 'opacity-60 pointer-events-none' : ''}`}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              style={{ transition: 'box-shadow 0.2s, transform 0.2s' }}
            >
              {/* Overlay for spinner or checkmark */}
              {showSpinner && (
                <div className="absolute inset-0 bg-zinc-950/70 flex flex-col items-center justify-center z-10 rounded-xl">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                  <span className="text-xs text-zinc-200">Generating PDF...</span>
                </div>
              )}
              {/* Animated checkmark */}
              <span className={`absolute top-3 right-3 text-blue-400 z-10 transition-all duration-300 ${isSelected && !generatingPDF ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-75 pointer-events-none'}`}>
                <CheckCircle2 className="w-6 h-6" />
              </span>
              <CardHeader>
                <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
                  {a.standard?.name || id}
                </CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
