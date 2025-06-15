import axios from '../axios';

const getChonMuaSamService = () => {
    return axios.get('/getChonKeHoachMuaSam');
};

const duyetKeHoach = (maKeHoach) => {
    return axios.put(`/kehoach/${maKeHoach}/duyet`);
};

const tuchoiKeHoach = (maKeHoach) => {
    return axios.post('/tuchoi-ke-hoach', { maKeHoach });
};

export default {
    getChonMuaSamService,
    duyetKeHoach,
    tuchoiKeHoach,
};
