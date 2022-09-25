import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  item: {}
};

const slice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    getStores(state, action) {
      state.items = action.payload.data;
    },
    getStore(state, action) {
      const store = action.payload;
      state.item = state.items.map((one) => one._id === store._id);
    },
    addStore(state, action) {
      const store = action.payload.data;
      state.items.push(store);
    },
    updateStore(state, action) {
      const store = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === store._id) return store;
        return one;
      });
    },
    deleteStore(state, action) {
      const store = action.payload.data;
      state.items = state.items.filter((one) => one._id !== store._id);
    }
  }
});

export const reducer = slice.reducer;

export const getStores = () => async (dispatch) => {
  const response = await axios.get('/api/store');
  dispatch(slice.actions.getStores(response.data));
};

export const getStore = (id) => async (dispatch) => {
  const response = await axios.get('/api/store/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getStore(response.data));
};

export const addStore = (store) => async (dispatch) => {
  const response = await axios.post('/api/store/add', {
    store
  });
  dispatch(slice.actions.addStore(response.data));
};
export const updateStore = (store) => async (dispatch) => {
  const response = await axios.post('/api/store', {
    store
  });
  dispatch(slice.actions.updateStore(response.data));
};

export const deleteStore = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/store/${id}`);
  dispatch(slice.actions.deleteStore(response.data));
};

export default slice;
