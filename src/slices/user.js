import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  item: {}
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUsers(state, action) {
      state.items = action.payload.data;
    },
    getUser(state, action) {
      const user = action.payload;
      state.item = state.items.map((one) => one._id === user._id);
    },
    addUser(state, action) {
      const user = action.payload.data;
      state.items.push(user);
    },
    updateUser(state, action) {
      const user = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === user._id) return user;
        return one;
      });
    },
    deleteUser(state, action) {
      const user = action.payload.data;
      state.items = state.items.filter((one) => one._id !== user._id);
    }
  }
});

export const reducer = slice.reducer;

export const getUsers = () => async (dispatch) => {
  const response = await axios.get('/api/user');
  dispatch(slice.actions.getUsers(response.data));
};

export const getUser = (id) => async (dispatch) => {
  const response = await axios.get('/api/user/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getUser(response.data));
};

export const addUser = (user) => async (dispatch) => {
  const response = await axios.post('/api/user/add', {
    user
  });
  dispatch(slice.actions.addUser(response.data));
};
export const updateUser = (user) => async (dispatch) => {
  const response = await axios.post('/api/user', { user });
  dispatch(slice.actions.updateUser(response.data));
};

export const deleteUser = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/user/${id}`);
  dispatch(slice.actions.deleteUser(response.data));
};

export default slice;
