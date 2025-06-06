import { createSlice } from '@reduxjs/toolkit';
const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        isLoggedIn: false,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isLoggedIn = true;
            localStorage.setItem('user', JSON.stringify(action.payload)); // Lưu vào localStorage
        },
        logout: (state) => {
            state.currentUser = null;
            state.isLoggedIn = false;
            localStorage.removeItem('user'); // Xoá khi logout
        },
    },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
