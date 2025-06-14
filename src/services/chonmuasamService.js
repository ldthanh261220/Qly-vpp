import axios from '../axios';

const getChonMuaSamService = () => {
    return axios.get('/getChonKeHoachMuaSam');
};

export default {
    getChonMuaSamService
};
