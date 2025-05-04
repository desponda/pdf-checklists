import axios from 'axios';

// In development with a proxy, we don't need to specify the full URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : '';

export const fetchAircraftList = async () => {
  try {
    const response = await axios.get(`/api/files`);
    return response.data;
  } catch (error) {
    console.error('Error fetching aircraft list:', error);
    throw error;
  }
};

export const generatePDF = async (pages) => {
  try {
    const response = await axios.post(
      `/api/generate-pdf`,
      { pages },
      {
        responseType: 'blob',
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
