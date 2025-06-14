import axios from '../axios';

const getAllHopDongService = () => {
    return axios.get(`/getDsHopDong`);
};

const getDetailHopDongService = (id) => {
    return axios.get(`/getChiTietHopDong/${id}`);
};

const deleteHopDongService = (id) => {
    return axios.delete(`/deleteHopDong/${id}`);
};

const updateHopDongService = (data) => {
  // data = { maHopDong, moTa, trangThai }
  return axios.put('/updateHopDong', data);
};

const createHopDongService = (data) => {
  // data = { maHopDong, moTa, trangThai }
  return axios.post('/createHopDong', data);
};

const updateMoiThauTaoHopDongService = (data) => {
  // data = { maPhienDauThau }
  return axios.put('/updatecreatedcontract', data);
};
export default {
    getAllHopDongService,
    getDetailHopDongService,
    deleteHopDongService,
    updateHopDongService,
    createHopDongService,
    updateMoiThauTaoHopDongService
};
