import axios from '../axios';

const getlistmuasamService = () => {
    return axios.get(`/getlistMuaSam`);
};

const getlistthietbiService = (maKeHoach) => {
  return axios.get(`/getlistthietbi/${maKeHoach}`);
};


export default {
    getlistmuasamService,
    getlistthietbiService
};
