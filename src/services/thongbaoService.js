import axios from '../axios';

// 1. Lấy danh sách thông báo theo mã tài khoản
const getThongBaoByTaiKhoan = (id) => {
    return axios.get(`/getDsThongBao/${id}`);
};

// 2. Lấy chi tiết thông báo theo mã thông báo
const getThongBaoById = (id) => {
    return axios.get(`/getChiTietThongBao/${id}`);
};

// 3. Tạo thông báo mới
const createThongBao = (data) => {
    return axios.post(`/themThongBao`, data);
};
const capNhatTrangThaiThongBao = (id) => {
    return axios.put('/capnhat_thongbao', { id });
};

export default {
    getThongBaoByTaiKhoan,
    getThongBaoById,
    createThongBao,
    capNhatTrangThaiThongBao,
};
