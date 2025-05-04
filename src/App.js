import React, { useState, useEffect } from 'react';
import { fetchAircraftList, generatePDF } from './services/api';
import AircraftSelector from './components/AircraftSelector';
import Header from './components/Header';
import Footer from './components/Footer';
import Welcome from './components/Welcome';
import HelpSection from './components/HelpSection';
import FloatingButton from './components/FloatingButton';
import ModeToggle from './components/ModeToggle';

function App() {
  const [aircraftData, setAircraftData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [preferDarkMode, setPreferDarkMode] = useState(() => {
    // Try to load preference from localStorage
    const savedPreference = localStorage.getItem('preferDarkMode');
    return savedPreference === 'true';
  });
  const [selectedAircraft, setSelectedAircraft] = useState(() => {
    // Try to load last selection from localStorage
    const savedAircraft = localStorage.getItem('lastSelectedAircraft');
    return savedAircraft || null;
  });
  const [selectedVariant, setSelectedVariant] = useState(() => {
    // Try to load last variant from localStorage
    const savedVariant = localStorage.getItem('lastSelectedVariant');
    return savedVariant || null;
  });
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage
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
    localStorage.setItem('lastSelectedAircraft', aircraftId);
    localStorage.setItem('lastSelectedVariant', variantType);
  };
  
  // Handle dark mode preference toggle
  const handleDarkModeToggle = (value) => {
    setPreferDarkMode(value);
    localStorage.setItem('preferDarkMode', value);
    
    // If we have a selected aircraft, check if we need to update the variant
    if (selectedAircraft) {
      const aircraft = aircraftData[selectedAircraft];
      const hasDarkVariant = Object.keys(aircraft.variants || {}).some(v => v.toLowerCase().includes('dark'));
      
      // If switching to dark mode and we have a dark variant available
      if (value && hasDarkVariant && (!selectedVariant || !selectedVariant.toLowerCase().includes('dark'))) {
        const darkVariant = Object.keys(aircraft.variants || {}).find(v => v.toLowerCase().includes('dark'));
        setSelectedVariant(darkVariant);
        localStorage.setItem('lastSelectedVariant', darkVariant);
      } 
      // If switching to light mode and we're currently on a dark variant
      else if (!value && selectedVariant && selectedVariant.toLowerCase().includes('dark') && aircraft.standard) {
        setSelectedVariant('standard');
        localStorage.setItem('lastSelectedVariant', 'standard');
      }
    }
  };

  const handleGeneratePDF = async () => {
    if (!selectedAircraft || !selectedVariant) return;

    try {
      setGeneratingPDF(true);
      setError(null);
      setPdfProgress(0);
      
      // Clear any previous notifications
      setNotification(null);

      let pages;
      let aircraftName;
      
      if (selectedVariant === 'standard') {
        pages = aircraftData[selectedAircraft].standard.pages;
        aircraftName = aircraftData[selectedAircraft].standard.name;
      } else {
        pages = aircraftData[selectedAircraft].variants[selectedVariant].pages;
        aircraftName = aircraftData[selectedAircraft].variants[selectedVariant].name;
      }
      
      // Save this selection in localStorage for future use
      localStorage.setItem('lastSelectedAircraft', selectedAircraft);
      localStorage.setItem('lastSelectedVariant', selectedVariant);
      
      // Show initial progress
      setPdfProgress(5);
      
      // Update user on what's happening
      setNotification({
        type: 'info',
        message: `Generating PDF for ${aircraftName} with ${pages.length} pages...`
      });
      
      // Set a progress timer to simulate progress while PDF is being generated
      const progressInterval = setInterval(() => {
        setPdfProgress(prev => {
          const newProgress = prev + 5;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 500);
      
      console.log(`Sending request to generate PDF with ${pages.length} pages`);
      const pdfBlob = await generatePDF(pages);
      console.log(`PDF blob received: ${pdfBlob.size} bytes`);
      
      // Verify the PDF blob
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Received empty PDF from server');
      }

      // Clear the progress interval
      clearInterval(progressInterval);
      setPdfProgress(100);
      
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      const filename = `${selectedAircraft}${selectedVariant !== 'standard' ? '_' + selectedVariant : ''}_checklist.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      
      // Click the link to download
      link.click();
      link.parentNode.removeChild(link);
      
      // Show success notification
      setNotification({
        type: 'success',
        message: `PDF successfully created for ${aircraftName} (${pages.length} pages). Downloading ${filename}...`
      });
      
      // Clean up the URL object after a short delay
      setTimeout(() => {
        try {
          window.URL.revokeObjectURL(url);
        } catch (e) {
          console.warn('Error cleaning up object URL:', e);
        }
      }, 1000);
      
    } catch (err) {
      // Extract the meaningful part of the error message if possible
      let errorMessage = 'Failed to generate PDF. Please try again later.';
      
      if (err && err.message) {
        if (err.message.includes('network error') || err.message.includes('timeout')) {
          errorMessage = 'Network timeout or server error. The PDF generation may take too long - try selecting fewer pages or try again later.';
        } else if (err.message.includes('Server did not return')) {
          errorMessage = 'The server could not generate the PDF. This could be due to image format issues or file access problems.';
        } else {
          // Just use the error message directly if it's meaningful
          errorMessage = `PDF generation failed: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      console.error('Error generating PDF:', err);
      setPdfProgress(0);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {notification && (
          <div className={`notification ${notification.type}`}>
            <span className="notification-icon">
              {notification.type === 'success' ? '✅' : '📢'}
            </span>
            {notification.message}
          </div>
        )}
        
        <Welcome />
        
        <HelpSection />
        
        <section className="section">
          <h2 className="section-title">Aircraft Checklist Selection</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading aircraft data...</p>
            </div>
          ) : (
            <>
              <div className="controls-sticky">
                <ModeToggle 
                  preferDarkMode={preferDarkMode}
                  onToggle={handleDarkModeToggle}
                />
              </div>
              
              <AircraftSelector 
                aircraftData={aircraftData}
                selectedAircraft={selectedAircraft}
                selectedVariant={selectedVariant}
                onSelect={handleAircraftSelect}
                preferDarkMode={preferDarkMode}
              />
              
              <FloatingButton
                onClick={handleGeneratePDF}
                disabled={!selectedAircraft || !selectedVariant}
                loading={generatingPDF}
                selectedAircraft={selectedAircraft}
                selectedVariant={selectedVariant}
                progress={pdfProgress}
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