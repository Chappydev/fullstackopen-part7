import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogService from '../services/blogs';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    loginAs(state, action) {
      return action.payload;
    },
    logout() {
      return null;
    }
  }
});

export const { loginAs, logout } = userSlice.actions;

export const loginWithCredentials = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({
      username,
      password
    });
    blogService.setToken(user.token);
    window.localStorage.setItem('loggedInUser', JSON.stringify(user));
    dispatch(loginAs(user));
  };
};

export const logoutCurrentUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedInUser');
    dispatch(logout());
  };
};

export default userSlice.reducer;
