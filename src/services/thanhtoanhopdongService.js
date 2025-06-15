import axios from '../axios';

const getChonHopDongService = () => {
    return axios.get('/getlisthopdong');
};
const getInforHopDongService = (id) => {
    return axios.get(`/getThongTinHopDong/${id}`);
};
const updateTrangThaiHopDongService = (id, status) => {
    return axios.put('/updateTrangThaiHopDong', { maHopDong: id, trangThai: status });
};


export default {
    getChonHopDongService,
    getInforHopDongService,
    updateTrangThaiHopDongService
};
