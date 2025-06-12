import axios from '../axios';

const getAllNhaThauService = () => {
    return axios.get(`/getDsNhaThau`);
};

const getDetailNhaThauService = (id) => {
    return axios.get(`/getChiTietNhaThau/${id}`);
};

export default {
    getAllNhaThauService,
    getDetailNhaThauService
};
