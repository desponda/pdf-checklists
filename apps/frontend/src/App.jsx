import React, { useState, useEffect } from 'react';
import { fetchAircraftList, generatePDF } from './services/api';
import AircraftSelector from './components/AircraftSelector';
import Header from './components/Header';
import Footer from './components/Footer';
import ModeToggle from './components/ModeToggle';
import { Toaster } from '@/components/ui/sonner.jsx';
import { toast } from 'sonner';

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center py-24 md:py-32 mb-20 overflow-visible">
      {/* Radial spotlight behind hero card (now purple/violet) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vw] bg-violet-500/20 rounded-full blur-3xl z-0" />
      {/* Glassy hero card */}
      <div className="glass-card px-10 py-12 rounded-3xl shadow-2xl border border-blue-200/10 bg-white/5 backdrop-blur-lg max-w-3xl w-full flex flex-col items-center relative z-10">
        <span className="relative inline-block px-8 py-2 text-zinc-100 text-lg md:text-xl font-light tracking-wide rounded-2xl mb-6 z-10" style={{ fontFamily: 'Inter, Roboto, Montserrat, Arial, sans-serif' }}>
          <span className="relative z-10">Your one stop for <span className="text-blue-400">flight checklists</span></span>
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 text-center drop-shadow-lg z-10">Flight Checklists</h1>
        <p className="text-lg md:text-2xl text-zinc-300 mb-2 text-center max-w-2xl z-10">Generate, download, and fly. All the top checklists, one place.</p>
      </div>
    </section>
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
        setError('Failed to load aircraft data. Please try again later.');
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

  // Handle checklist variant preference toggle
  const handleChecklistVariantToggle = (value) => {
    setPreferDarkChecklist(value);
    localStorage.setItem('preferDarkChecklist', value);
    // If we have a selected aircraft, update the variant to match the preference
    if (selectedAircraft) {
      const aircraft = aircraftData[selectedAircraft];
      if (!aircraft) return;
      if (value) {
        // Prefer dark variant if available
        const darkVariant = Object.keys(aircraft.variants || {}).find(v => v.toLowerCase().includes('dark'));
        if (darkVariant) {
          setSelectedVariant(darkVariant);
        }
      } else {
        // Prefer standard variant if available
        if (aircraft.standard) {
          setSelectedVariant('standard');
        }
      }
    }
  };

  // Accept aircraftId and variantType as parameters
  const handleGeneratePDF = async (aircraftId, variantType) => {
    if (!aircraftId || !variantType) return;
    try {
      setGeneratingPDF(true);
      setError(null);
      let pages;
      let aircraftName;
      if (variantType === 'standard') {
        pages = aircraftData[aircraftId].standard.pages;
        aircraftName = aircraftData[aircraftId].standard.name;
      } else {
        pages = aircraftData[aircraftId].variants[variantType].pages;
        aircraftName = aircraftData[aircraftId].variants[variantType].name;
      }
      toast.info(`Generating PDF for ${aircraftName} with ${pages.length} pages...`);
      const pdfBlob = await generatePDF(pages);
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Received empty PDF from server');
      }
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      const filename = `${aircraftId}${variantType !== 'standard' ? '_' + variantType : ''}_checklist.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success(`PDF successfully created for ${aircraftName} (${pages.length} pages). Downloading ${filename}...`);
      setTimeout(() => {
        try {
          window.URL.revokeObjectURL(url);
        } catch (e) {
          console.warn('Error cleaning up object URL:', e);
        }
      }, 1000);
    } catch (err) {
      let errorMessage = 'Failed to generate PDF. Please try again later.';
      if (err && err.message) {
        if (err.message.includes('network error') || err.message.includes('timeout')) {
          errorMessage = 'Network timeout or server error. The PDF generation may take too long - try selecting fewer pages or try again later.';
        } else if (err.message.includes('Server did not return')) {
          errorMessage = 'The server could not generate the PDF. This could be due to image format issues or file access problems.';
        } else {
          errorMessage = `PDF generation failed: ${err.message}`;
        }
      }
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error generating PDF:', err);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb]">
      {/* Layered animated blurred gradient blobs for depth, with teal and white accents */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/3 top-0 w-[60vw] h-[60vw] bg-blue-700/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute right-0 bottom-0 w-[40vw] h-[40vw] bg-indigo-500/20 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay:'4s'}} />
        <div className="absolute left-0 bottom-1/4 w-[30vw] h-[30vw] bg-teal-300/10 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay:'2s'}} />
        <div className="absolute left-1/2 top-1/3 w-[50vw] h-[30vw] -translate-x-1/2 bg-white/10 rounded-full blur-2xl" />
      </div>
      <Toaster position="top-right" richColors />
      <Header />
      <main className="main-content max-w-5xl mx-auto px-2 pb-16 pt-32">
        <Hero />
        {error && (
          <div className="w-full max-w-2xl mx-auto my-4">
            <div className="bg-red-900 text-red-200 rounded-lg px-4 py-3 shadow border border-red-800">
              <span className="font-bold mr-2">Error:</span>{error}
            </div>
          </div>
        )}
        <section id="checklists" className="section mt-24">
          <h2 className="section-title text-xl font-semibold text-zinc-200 mb-4">Select a Checklist To Download</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-zinc-400">Loading aircraft data...</p>
            </div>
          ) : (
            <>
              <div className="controls-sticky mb-4">
                <ModeToggle 
                  preferDarkChecklist={preferDarkChecklist}
                  onToggle={handleChecklistVariantToggle}
                />
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
      </main>
      <Footer />
    </div>
  );
}

export default App;