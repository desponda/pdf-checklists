import { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Check, Download, Loader2, Search, SlidersHorizontal } from 'lucide-react';
import { IoMdAirplane } from 'react-icons/io';
import { GiAirplane } from 'react-icons/gi';
import { FaHelicopter, FaFighterJet, FaWrench } from 'react-icons/fa';

const CATEGORY_LABELS = {
  airliner: 'Airliners',
  general_aviation: 'General Aviation',
  helicopter: 'Helicopters',
  military: 'Military',
  wip: 'Work in Progress',
};

const CATEGORY_ICONS = {
  Airliners: IoMdAirplane,
  'General Aviation': GiAirplane,
  Helicopters: FaHelicopter,
  Military: FaFighterJet,
  'Work in Progress': FaWrench,
};

function getVariant(aircraft, preferDarkChecklist) {
  if (preferDarkChecklist) {
    const darkKey = Object.keys(aircraft.variants || {}).find((v) => v.toLowerCase().includes('dark'));
    if (darkKey) return { type: darkKey, data: aircraft.variants[darkKey] };
  }
  if (aircraft.standard) return { type: 'standard', data: aircraft.standard };
  return null;
}

function AircraftCard({ id, aircraft, isSelected, generatingPDF, preferDarkChecklist, onSelect, onGenerate }) {
  const variant = useMemo(() => getVariant(aircraft, preferDarkChecklist), [aircraft, preferDarkChecklist]);
  if (!variant) return null;

  const name = variant.data?.name || aircraft.standard?.name || id;
  const displayCategory = CATEGORY_LABELS[aircraft.category] || aircraft.category || 'Aircraft';
  const Icon = CATEGORY_ICONS[displayCategory] || IoMdAirplane;
  const pageCount = variant.data?.pages?.length || 0;
  const showSpinner = generatingPDF && isSelected;

  const selectCard = () => {
    if (!generatingPDF) {
      onSelect(id, variant.type);
      onGenerate(id, variant.type);
    }
  };

  return (
    <Card
      className={`aircraft-card ${isSelected ? 'selected-card border-violet-400/60' : ''} ${generatingPDF && !isSelected ? 'is-disabled' : ''}`}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      onClick={selectCard}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectCard();
        }
      }}
    >
      {showSpinner && <div className="card-loading"><Loader2 className="spin" size={22} /><span>Generating PDF...</span></div>}
      <div className="card-topline"><span className="aircraft-category">{displayCategory}</span><span className="card-status">{isSelected ? <Check size={14} /> : 'PDF'}</span></div>
      <div className="aircraft-icon"><Icon size={26} aria-hidden="true" /></div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{pageCount ? `${pageCount} checklist pages` : 'Checklist ready to generate'}</CardDescription>
      </CardHeader>
      <div className="card-action-row">
        <span>Open checklist</span>
        <span className="download-chip" aria-label="Download PDF"><Download size={15} /></span>
      </div>
    </Card>
  );
}

export default function AircraftSelector({ aircraftData, selectedAircraft, onSelect, onGenerate, preferDarkChecklist, generatingPDF, loading = false }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Aircraft');

  const categories = useMemo(() => {
    const unique = new Set(Object.values(aircraftData).map((aircraft) => aircraft.category).filter(Boolean));
    return ['All Aircraft', ...Array.from(unique).map((item) => CATEGORY_LABELS[item] || item).sort()];
  }, [aircraftData]);

  const filteredAircraft = useMemo(() => Object.entries(aircraftData).filter(([id, aircraft]) => {
    const name = aircraft.standard?.name || id;
    if (search && !name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'All Aircraft' && (CATEGORY_LABELS[aircraft.category] || aircraft.category) !== category) return false;
    return Boolean(getVariant(aircraft, preferDarkChecklist));
  }), [aircraftData, category, preferDarkChecklist, search]);

  return (
    <div className="selector-shell">
      <div className="selector-toolbar">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <Input placeholder="Search aircraft..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search aircraft" />
          {search && <button type="button" className="clear-search" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
        </label>
        <div className="filter-label"><SlidersHorizontal size={15} /> Filter</div>
        <div className="category-filters">
          {categories.map((cat) => <button type="button" key={cat} className={`category-chip ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>{cat}</button>)}
        </div>
        <span className="text-zinc-400 result-count">Showing <strong>{filteredAircraft.length}</strong> of <strong>{Object.keys(aircraftData).length}</strong> aircraft</span>
      </div>

      {loading ? (
        <div className="aircraft-grid">{[...Array(6)].map((_, index) => <div key={index} className="aircraft-skeleton" />)}</div>
      ) : (
        <div className="aircraft-grid">
          {filteredAircraft.map(([id, aircraft]) => <AircraftCard key={id} id={id} aircraft={aircraft} isSelected={selectedAircraft === id} generatingPDF={generatingPDF} preferDarkChecklist={preferDarkChecklist} onSelect={onSelect} onGenerate={onGenerate} />)}
          {filteredAircraft.length === 0 && <div className="empty-results"><div className="empty-icon">✈</div><p>No aircraft found matching your search.</p><span>Try another aircraft name or category.</span></div>}
        </div>
      )}
    </div>
  );
}
