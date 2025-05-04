import React, { useState, useEffect } from 'react';
import { fetchAircraftList, generatePDF } from './services/api';
import AircraftSelector from './components/AircraftSelector';
import Header from './components/Header';
import Footer from './components/Footer';
import ModeToggle from './components/ModeToggle';
import { Toaster } from '@/components/ui/sonner.jsx';
import { toast } from 'sonner';

function App() {
  const [aircraftData, setAircraftData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferDarkChecklist, setPreferDarkChecklist] = useState(() => {
    const savedPreference = localStorage.getItem('preferDarkChecklist');
    return savedPreference === null ? true : savedPreference === 'true';
  });
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favoriteAircraft');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

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
      setPdfProgress(0);
      let pages;
      let aircraftName;
      if (variantType === 'standard') {
        pages = aircraftData[aircraftId].standard.pages;
        aircraftName = aircraftData[aircraftId].standard.name;
      } else {
        pages = aircraftData[aircraftId].variants[variantType].pages;
        aircraftName = aircraftData[aircraftId].variants[variantType].name;
      }
      setPdfProgress(5);
      toast.info(`Generating PDF for ${aircraftName} with ${pages.length} pages...`);
      const progressInterval = setInterval(() => {
        setPdfProgress(prev => {
          const newProgress = prev + 5;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 500);
      const pdfBlob = await generatePDF(pages);
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Received empty PDF from server');
      }
      clearInterval(progressInterval);
      setPdfProgress(100);
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
      setPdfProgress(0);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen">
      <Toaster position="top-right" richColors />
      <Header />
      <main className="main-content max-w-5xl mx-auto px-2 pb-16">
        {error && (
          <div className="w-full max-w-2xl mx-auto my-4">
            <div className="bg-red-900 text-red-200 rounded-lg px-4 py-3 shadow border border-red-800">
              <span className="font-bold mr-2">Error:</span>{error}
            </div>
          </div>
        )}
        <section className="section mt-8">
          <h2 className="section-title text-xl font-semibold text-zinc-200 mb-4">Aircraft Checklist Selection</h2>
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