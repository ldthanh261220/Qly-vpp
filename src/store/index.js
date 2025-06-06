import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';

const persistedUser = localStorage.getItem('user');
const initialUserState = {
    currentUser: persistedUser ? JSON.parse(persistedUser) : null,
    isLoggedIn: !!persistedUser,
};

const store = configureStore({
    reducer: {
        user: (state = initialUserState, action) => userReducer(state, action),
    },
});

export default store;
