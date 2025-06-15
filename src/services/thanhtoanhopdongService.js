import axios from '../axios';

const getChonHopDongService = () => {
    return axios.get('/getlisthopdong');
};
const getdetailhopdongService = (maHopDong) => {
  return axios.get(`/getThongTinHopDong/${maHopDong}`);
};

export default {
    getChonHopDongService,
    getdetailhopdongService
};
