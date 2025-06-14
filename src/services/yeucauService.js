import axios from '../axios';

const getAllYeuCauService = () => {
    return axios.get(`/getDsYeuCau`);
};

const getDetailYeuCauService = (id) => {
    return axios.get(`/getChiTietYeuCau/${id}`);
};

const duyetYeuCauService = (maYeuCau, ngayDuyet) => {
    return axios.post(`/duyetYeuCau`, {
        maYeuCau,
        ngayDuyet
    });
};

const tuChoiYeuCauService = (maYeuCau, ngayDuyet, lyDoTuChoi) => {
    return axios.post(`/tuChoiYeuCau`, {
        maYeuCau,
        ngayDuyet,
        lyDoTuChoi
    });
};

const deleteYeuCauService = (id) => {
    return axios.delete(`/deleteYeuCau/${id}`);
};

export default {
    getAllYeuCauService,
    getDetailYeuCauService,
    duyetYeuCauService,
    tuChoiYeuCauService,
    deleteYeuCauService
};
