import axios from '../axios';

const getDashboardData = (month, year) => {
  return axios.get('/dashboard', {
    params: { month, year }
  });
};

export default {
  getDashboardData,
};
