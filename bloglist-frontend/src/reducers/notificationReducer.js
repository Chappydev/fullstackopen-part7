import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isShown: false,
  isError: false,
  message: ''
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return {
        isShown: true,
        isError: false,
        message: action.payload
      };
    },
    setError(state, action) {
      return {
        isShown: true,
        isError: true,
        message: action.payload
      };
    },
    hideNotification(state) {
      state.isShown = false;
      state.message = '';
    }
  }
});

export const { setNotification, setError, hideNotification } =
  notificationSlice.actions;

let currentTimeout = undefined;

export const showNotification = (message, seconds) => {
  return (dispatch) => {
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    dispatch(setNotification(message));
    currentTimeout = setTimeout(() => {
      dispatch(hideNotification());
    }, seconds * 1000);
  };
};

export const showError = (message, seconds) => {
  return (dispatch) => {
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    dispatch(setError(message));
    currentTimeout = setTimeout(() => {
      dispatch(hideNotification());
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;
