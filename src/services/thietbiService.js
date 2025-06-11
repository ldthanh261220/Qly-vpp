import axios from '../axios';

const getAllThietbiService = () => {
    return axios.get(`/get_thietbi`);
};
const getAllPhongService = () => {
    return axios.get(`/get_phong`);
};
const getAllDanhMucService = () => {
    return axios.get(`/get_danhmuc`);
};
export default {
    getAllThietbiService,
    getAllPhongService,
    getAllDanhMucService,
};
