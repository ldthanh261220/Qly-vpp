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
        },
        logout: (state) => {
            state.currentUser = null;
            state.isLoggedIn = false;
        },
    },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
