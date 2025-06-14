import axios from '../axios';

const getAllNhaThauService = () => {
    return axios.get(`/getDsNhaThau`);
};

const getDetailNhaThauService = (id) => {
    return axios.get(`/getChiTietNhaThau/${id}`);
};

const deleteNhaThauService = (id) => {
    return axios.delete(`/deleteNhaThau/${id}`);
};

const createNhaThauService = (data) => {
    return axios.post('/createNhaThau', data);
};
export default {
    getAllNhaThauService,
    getDetailNhaThauService,
    deleteNhaThauService,
    createNhaThauService
};
