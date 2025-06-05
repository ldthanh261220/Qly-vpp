import axios from '../axios';

const handleLogin = (email, password) => {
    return axios.post('/login', {
        email,
        password,
    });
};
const getAllUsersService = (inputId) => {
    return axios.get(`/get-all-users?id=${inputId}`);
};
const createNewUserService = (data) => {
    console.log('check data from service: ', data);
    return axios.post('/create-new-user', data);
};
const editUserService = (data) => {
    console.log('check data from service: ', data);
    return axios.put('/edit-user', data);
};
const deleteUserService = (userId) => {
    return axios.delete('/delete-user', {
        data: {
            id: userId,
        },
    });
};
export default {
    handleLogin,
    getAllUsersService,
    createNewUserService,
    editUserService,
    deleteUserService,
};
