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
const createNewDeviceService = (formData) => {
    console.log('check data from service: ', formData);
    return axios.post('/create-new-thietbi', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
const editDeviceService = (formData) => {
    console.log('check data from service: ', formData);
    return axios.put('/edit-thietbi', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
const deleteDeviceService = (maThietBi) => {
    return axios.delete('/delete-thietbi', {
        data: {
            id: maThietBi,
        },
    });
};
export default {
    getAllThietbiService,
    getAllPhongService,
    getAllDanhMucService,
    createNewDeviceService,
    editDeviceService,
    deleteDeviceService,
};
