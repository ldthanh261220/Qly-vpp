import axios from '../axios';

const handleLogin = (email, password) => {
    return axios.post('/api/login', {
        email,
        password,
    });
};
const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
};
export default {
    handleLogin,
    getAllUsers,
};
