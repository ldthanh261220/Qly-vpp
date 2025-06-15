import axios from '../axios';

const getlistmuasamService = () => {
    return axios.get(`/getlistMuaSam`);
};

const getlistthietbiService = (maKeHoach) => {
    return axios.get(`/getlistthietbi/${maKeHoach}`);
};
const duyetngansach = (maKeHoach) => {
    return axios.put(`/ngansach/${maKeHoach}/duyet`);
};

const tuchoingansach = (maKeHoach) => {
    return axios.put(`/tuchoi_ngansach/${maKeHoach}/duyet`);
};

export default {
    getlistmuasamService,
    getlistthietbiService,
    duyetngansach,
    tuchoingansach,
};
