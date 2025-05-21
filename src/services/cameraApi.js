// services/api.js
import axios from 'axios';

const API_BASE_URL = '/api';

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const fetchAllCounts = async () => {
  try {
    const [cameras, whitelisted, nonWhitelisted, unclearPictures] = await Promise.all([
      axios.get(`${API_BASE_URL}/cameras/count`, getAuthConfig()),
      axios.get(`${API_BASE_URL}/whitelisted/count`, getAuthConfig()),
      axios.get(`${API_BASE_URL}/nonwhitelisted/count`, getAuthConfig()),
      axios.get(`${API_BASE_URL}/unclear/count`, getAuthConfig())
    ]);

    return {
      cameras: cameras.data.count,
      whitelisted: whitelisted.data.count,
      nonWhitelisted: nonWhitelisted.data.count,
      unclearPictures: unclearPictures.data.count
    };
  } catch (error) {
    console.error('Error fetching counts:', error);
    return null;
  }
};

export const fetchDetails = async (type) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${type}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    return [];
  }
};
