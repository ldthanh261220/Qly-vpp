import axios from '../axios';

const getTatCaNhaThauService = () => {
    return axios.get(`/getChonNhaThau`);
};

const getXemChiTietNhaThauService = (id) => {
    return axios.get(`/getXemChiTietNhaThau/${id}`);
};

export default {
    getTatCaNhaThauService,
    getXemChiTietNhaThauService
};
