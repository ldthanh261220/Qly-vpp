import axios from '../axios';

const createNewRequestService = (formData) => {
    console.log('check data from service: ', formData);
    return axios.post('/create-yeucau', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default {
    createNewRequestService,
};
