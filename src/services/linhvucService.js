import axios from '../axios';

const getAllLinhVucService = () => {
    return axios.get(`/getDsLinhVuc`);
};

export default {
    getAllLinhVucService
};
