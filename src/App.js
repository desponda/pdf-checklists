import React, { useState, useEffect } from 'react';
import { fetchAircraftList, generatePDF } from './services/api';
import AircraftSelector from './components/AircraftSelector';
import Header from './components/Header';
import Footer from './components/Footer';
import Welcome from './components/Welcome';
import HelpSection from './components/HelpSection';
import HelpSection from './components/HelpSection';

function App() {
  const [aircraftData, setAircraftData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

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
      
      // Show initial progress
      setPdfProgress(5);
      
      // Set a progress timer to simulate progress while PDF is being generated
      const progressInterval = setInterval(() => {
        setPdfProgress(prev => {
          const newProgress = prev + 5;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 500);
      
      const pdfBlob = await generatePDF(pages);
      
      // Clear the progress interval
      clearInterval(progressInterval);
      setPdfProgress(100);
      
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `${selectedAircraft}${selectedVariant !== 'standard' ? '_' + selectedVariant : ''}_checklist.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      // Show success notification
      setNotification({
        type: 'success',
        message: `PDF successfully created for ${aircraftName} (${pages.length} pages). Downloading ${filename}...`
      });
      
      // Clean up the URL object
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
    } catch (err) {
      setError('Failed to generate PDF. Please try again later.');
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
              <AircraftSelector 
                aircraftData={aircraftData}
                selectedAircraft={selectedAircraft}
                selectedVariant={selectedVariant}
                onSelect={handleAircraftSelect}
              />
              
              <div className="generate-button">
                <button 
                  onClick={handleGeneratePDF}
                  disabled={!selectedAircraft || !selectedVariant || generatingPDF}
                  className={generatingPDF ? 'loading' : ''}
                >
                  {generatingPDF ? 'Generating PDF...' : 'Generate PDF Checklist'}
                </button>
                
                {generatingPDF && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${pdfProgress}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">{pdfProgress}%</div>
                  </div>
                )}
                
                {!selectedAircraft && (
                  <p className="generate-tip">Please select an aircraft to generate a PDF checklist</p>
                )}
                
                {selectedAircraft && selectedVariant && !generatingPDF && (
                  <p className="generate-info">
                    Ready to generate checklist for {selectedAircraft} 
                    {selectedVariant !== 'standard' ? ` (${selectedVariant})` : ''}
                  </p>
                )}
              </div>
            </>
          )}
        </section>
        
        <HelpSection />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;