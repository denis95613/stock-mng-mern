import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  item: {}
};

const slice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    getNotifications(state, action) {
      state.items = action.payload.data;
    },
    getNotification(state, action) {
      const notification = action.payload;
      state.item = state.items.map((one) => one._id === notification._id);
    },
    addNotification(state, action) {
      const notification = action.payload.data;
      state.items.push(notification);
    },
    updateNotification(state, action) {
      const notification = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === notification._id) return notification;
        return one;
      });
    },
    deleteNotification(state, action) {
      const notification = action.payload.data;
      state.items = state.items.filter((one) => one._id !== notification._id);
    }
  }
});

export const reducer = slice.reducer;

export const getNotifications = () => async (dispatch) => {
  const response = await axios.get('/api/notification');
  dispatch(slice.actions.getNotifications(response.data));
};

export const getNotification = (id) => async (dispatch) => {
  const response = await axios.get(
    '/api/notification/:id',
    {
      params: {
        id
      }
    }
  );
  dispatch(slice.actions.getNotification(response.data));
};

export const addNotification = (notification) => async (dispatch) => {
  const response = await axios.post(
    '/api/notification/add',
    { notification }
  );
  dispatch(slice.actions.addNotification(response.data));
};
export const updateNotification = (notification) => async (dispatch) => {
  const response = await axios.post('/api/notification', {
    notification
  });
  dispatch(slice.actions.updateNotification(response.data));
};

export const deleteNotification = (id) => async (dispatch) => {
  const response = await axios.delete(
    `/api/notification/${id}`
  );
  dispatch(slice.actions.deleteNotification(response.data));
};

export default slice;
