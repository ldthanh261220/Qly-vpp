import axios from '../axios';

const getChonHopDongService = () => {
    return axios.get('/getlisthopdong');
};
const getInforHopDongService = (id) => {
    return axios.get(`/getThongTinHopDong/${id}`);
};

export default {
    getChonHopDongService,
    getInforHopDongService
};
