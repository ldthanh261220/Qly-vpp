import axios from '../axios';

const getAllThietbiService = () => {
    return axios.get(`/get_thietbi`);
};
const getAllPhongService = () => {
    return axios.get(`/get_phong`);
};

export default {
    getAllThietbiService,
    getAllPhongService,
};
