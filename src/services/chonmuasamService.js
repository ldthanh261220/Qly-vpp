import axios from '../axios';

const getChonMuaSamService = () => {
    return axios.get('/getChonKeHoachMuaSam');
};

const duyetKeHoach = (maKeHoach) => {
    return axios.put(`/kehoach/${maKeHoach}/duyet`);
};

const tuchoiKeHoach = (maKeHoach) => {
    return axios.put(`/tuchoi_kehoach/${maKeHoach}/duyet`);
};

export default {
    getChonMuaSamService,
    duyetKeHoach,
    tuchoiKeHoach,
};
