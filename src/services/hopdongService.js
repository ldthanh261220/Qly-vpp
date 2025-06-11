import axios from '../axios';

const getAllHopDongService = () => {
    return axios.get(`/getDsHopDong`);
};

const getDetailHopDongService = (id) => {
    return axios.get(`/getChiTietHopDong/${id}`);
};

export default {
    getAllHopDongService,
    getDetailHopDongService
};
