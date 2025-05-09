import axios from 'axios';

// Always use relative path so Vite proxy works
const API_URL = '';

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
    const response = await axios.post(`${API_URL}/api/generate`, { pages }, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
