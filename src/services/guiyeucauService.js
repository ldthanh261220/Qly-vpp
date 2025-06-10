import axios from '../axios';

const createNewRequestService = (data) => {
    console.log('check data from service: ', data);
    return axios.post('/create-yeucau', data);
};

export default {
    createNewRequestService,
};
