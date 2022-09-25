import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  item: {}
};

const slice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    getShops(state, action) {
      state.items = action.payload.data;
    },
    getShop(state, action) {
      const shop = action.payload;
      state.item = state.items.map((one) => one._id === shop._id);
    },
    addShop(state, action) {
      const shop = action.payload.data;
      state.items.push(shop);
    },
    updateShop(state, action) {
      const shop = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === shop._id) return shop;
        return one;
      });
    },
    deleteShop(state, action) {
      const shop = action.payload.data;
      state.items = state.items.filter((one) => one._id !== shop._id);
    },
    setShop(state, action) {
      state.item = action.payload;
    }
  }
});

export const reducer = slice.reducer;

export const getShops = () => async (dispatch) => {
  const response = await axios.get('/api/shop');
  dispatch(slice.actions.getShops(response.data));
};

export const getShop = (id) => async (dispatch) => {
  const response = await axios.get('/api/shop/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getShop(response.data));
};

export const addShop = (shop) => async (dispatch) => {
  const response = await axios.post('/api/shop/add', {
    shop
  });
  dispatch(slice.actions.addShop(response.data));
};
export const updateShop = (shop) => async (dispatch) => {
  const response = await axios.post('/api/shop', { shop });
  dispatch(slice.actions.updateShop(response.data));
};

export const deleteShop = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/shop/${id}`);
  dispatch(slice.actions.deleteShop(response.data));
};

export const setShop = (shop) => async (dispatch) => {
  dispatch(slice.actions.setShop(shop));
};

export default slice;
