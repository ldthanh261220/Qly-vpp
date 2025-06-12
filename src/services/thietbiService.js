import axios from '../axios';

const getAllThietbiService = (idDanhMuc) => {
    if (idDanhMuc) {
        return axios.get(`/get_thietbi?idDanhMuc=${idDanhMuc}`);
    }
    return axios.get(`/get_thietbi`);
};

const getAllPhongService = () => {
    return axios.get(`/get_phong`);
};
const getAllDanhMucService = (idDanhMuc) => {
    if (idDanhMuc) {
        return axios.get(`/get_danhmuc?idDanhMuc=${idDanhMuc}`);
    }
    return axios.get(`/get_danhmuc`);
};
export default {
    getAllThietbiService,
    getAllPhongService,
    getAllDanhMucService,
};
