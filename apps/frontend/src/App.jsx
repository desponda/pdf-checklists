import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, Layers3, Plane, ShieldCheck, Sparkles } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner.jsx';
import { toast } from 'sonner';
import { fetchAircraftList, generatePDF } from './services/api';
import AircraftSelector from './components/AircraftSelector';
import Header from './components/Header';
import Footer from './components/Footer';
import ModeToggle from './components/ModeToggle';

function Hero() {
  return (
    <section className="hero-shell" aria-labelledby="page-title">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> Flight deck / MSFS 2020 + 2024</div>
        <h1 id="page-title">Every flight starts <span>prepared.</span></h1>
        <p className="hero-lede">
          Find the right aircraft checklist, choose your preferred format, and download a clean PDF before you taxi.
        </p>
        <a className="hero-link" href="#checklists">
          Browse the fleet <ArrowDown aria-hidden="true" size={16} />
        </a>
      </div>

      <div className="hero-panel" aria-label="Checklist catalog highlights">
        <div className="panel-kicker"><Sparkles size={15} /> Ready room</div>
        <div className="panel-route"><span>CHECKLISTS</span><span className="route-line" /><span>PDF</span></div>
        <div className="panel-heading">Your pre-flight, streamlined.</div>
        <p>One catalog. Practical checklists. No digging through folders.</p>
        <div className="panel-stats">
          <div><strong>05</strong><span>categories</span></div>
          <div><strong>02</strong><span>formats</span></div>
          <div><strong>1-click</strong><span>download</span></div>
        </div>
      </div>
    </section>
  );
}

function CatalogIntro() {
  return (
    <div className="catalog-intro">
      <div>
        <div className="section-label">01 / Choose your aircraft</div>
        <h2>Build your checklist</h2>
        <p>Search the catalog, then select a card to generate your PDF.</p>
      </div>
      <div className="catalog-note"><ShieldCheck size={17} /><span>Updated from the MSFS checklist index</span></div>
    </div>
  );
}

function App() {
  const [aircraftData, setAircraftData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferDarkChecklist, setPreferDarkChecklist] = useState(() => {
    const savedPreference = localStorage.getItem('preferDarkChecklist');
    return savedPreference === null ? false : savedPreference === 'true';
  });
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    const loadAircraftData = async () => {
      try {
        setLoading(true);
        const data = await fetchAircraftList();
        setAircraftData(data);
        setError(null);
      } catch (err) {
        setError('The catalog could not be loaded. Please refresh and try again.');
        console.error('Error loading aircraft data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAircraftData();
  }, []);

  const handleAircraftSelect = (aircraftId, variantType) => {
    setSelectedAircraft(aircraftId);
    setSelectedVariant(variantType);
  };

  const handleChecklistVariantToggle = (value) => {
    setPreferDarkChecklist(value);
    localStorage.setItem('preferDarkChecklist', value);
    if (selectedAircraft) {
      const aircraft = aircraftData[selectedAircraft];
      if (!aircraft) return;
      if (value) {
        const darkVariant = Object.keys(aircraft.variants || {}).find((v) => v.toLowerCase().includes('dark'));
        if (darkVariant) setSelectedVariant(darkVariant);
      } else if (aircraft.standard) {
        setSelectedVariant('standard');
      }
    }
  };

  const handleGeneratePDF = async (aircraftId, variantType) => {
    if (!aircraftId || !variantType) return;
    try {
      setGeneratingPDF(true);
      setError(null);
      const aircraft = aircraftData[aircraftId];
      const selected = variantType === 'standard' ? aircraft.standard : aircraft.variants[variantType];
      const pages = selected.pages;
      const aircraftName = selected.name;
      toast.info(`Preparing ${aircraftName} · ${pages.length} pages`);
      const pdfBlob = await generatePDF(pages);
      if (!pdfBlob || pdfBlob.size === 0) throw new Error('Received empty PDF from server');
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      const filename = `${aircraftId}${variantType !== 'standard' ? `_${variantType}` : ''}_checklist.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Checklist ready · downloading ${filename}`);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      const errorMessage = err?.message?.includes('timeout')
        ? 'The catalog took too long to respond. Please try again.'
        : `PDF generation failed: ${err?.message || 'Please try again later.'}`;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error generating PDF:', err);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="app-shell">
      <Toaster position="top-right" richColors />
      <Header />
      <main>
        <div className="page-wrap">
          <Hero />
          <div className="signal-strip" aria-label="Catalog features">
            <div><Plane size={17} /><span>Built for sim pilots</span></div>
            <div><Layers3 size={17} /><span>Light + dark variants</span></div>
            <div><ArrowUpRight size={17} /><span>Fast PDF export</span></div>
          </div>

          <section id="checklists" className="catalog-section">
            <CatalogIntro />
            {error && <div className="error-banner" role="alert"><strong>Something went wrong.</strong><span>{error}</span></div>}
            {loading ? (
              <div className="loading-state"><div className="loading-spinner" /><p>Loading the aircraft catalog…</p></div>
            ) : (
              <>
                <div className="controls-sticky">
                  <ModeToggle preferDarkChecklist={preferDarkChecklist} onToggle={handleChecklistVariantToggle} />
                </div>
                <AircraftSelector
                  aircraftData={aircraftData}
                  selectedAircraft={selectedAircraft}
                  selectedVariant={selectedVariant}
                  onSelect={handleAircraftSelect}
                  onGenerate={handleGeneratePDF}
                  preferDarkChecklist={preferDarkChecklist}
                  generatingPDF={generatingPDF}
                />
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
