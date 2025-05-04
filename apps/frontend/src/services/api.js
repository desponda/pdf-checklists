import axios from 'axios';

// Get the current hostname for development environment
const currentHost = window.location.hostname;
const currentPort = window.location.port === '3000' ? '5000' : window.location.port;
const protocol = window.location.protocol;

// Create the base URL for API calls
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : `${protocol}//${currentHost}:${currentPort}`;

export const fetchAircraftList = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/files`);
    return response.data;
  } catch (error) {
    console.error('Error fetching aircraft list:', error);
    throw error;
  }
};

export const generatePDF = async (pages) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/generate-pdf`,
      { pages },
      {
        responseType: 'blob',
        timeout: 60000, // 60-second timeout for large PDFs
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        },
        onDownloadProgress: (progressEvent) => {
          // You could use this to update progress if needed
          console.log(`Downloaded: ${progressEvent.loaded} bytes`);
        }
      }
    );
    
    // Verify we received a PDF
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/pdf')) {
      console.log(`PDF received successfully: ${response.data.size} bytes`);
      return response.data;
    } else {
      console.error('Received non-PDF response:', contentType);
      throw new Error('Server did not return a valid PDF');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // If we got a response but it wasn't successful
    if (error.response) {
      console.error('Error data:', error.response.data);
      // If the server returned JSON error info
      if (error.response.data instanceof Blob) {
        try {
          // Try to parse the error response as JSON
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || 'Server error generating PDF');
        } catch (parseError) {
          // If we can't parse the error, throw the original
          throw error;
        }
      }
    }
    
    throw error;
  }
};
