import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useState, useMemo } from "react";

export default function AircraftSelector({ aircraftData, selectedAircraft, selectedVariant, onSelect, preferDarkChecklist }) {
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
              const data = a.variants[darkKey];
              variant = { type: darkKey, label: 'Dark', pages: data.pages.length };
            }
          } else {
            if (a.standard) {
              variant = { type: 'standard', label: 'Standard', pages: a.standard.pages.length };
            }
          }
          if (!variant) return null;
          return (
            <Card
              key={id}
              className={`transition-all border-2 ${isSelected ? 'border-blue-500 shadow-xl' : 'border-zinc-800'} bg-zinc-900 hover:border-blue-400 cursor-pointer`}
            >
              <CardHeader>
                <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
                  {a.standard?.name || id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button
                    key={variant.type}
                    variant={selectedVariant === variant.type && isSelected ? 'default' : 'outline'}
                    className={`w-full justify-between ${selectedVariant === variant.type && isSelected ? 'bg-blue-700 text-white' : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'}`}
                    onClick={() => onSelect(id, variant.type)}
                  >
                    <span>{variant.label}</span>
                    <span className="text-xs text-zinc-400">{variant.pages} pages</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
