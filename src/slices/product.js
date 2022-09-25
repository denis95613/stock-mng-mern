import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  item: {}
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    getProducts(state, action) {
      state.items = action.payload.data;
    },
    getProduct(state, action) {
      const product = action.payload;
      state.item = product;
    },
    addProduct(state, action) {
      const product = action.payload.data;
      state.items.push(product);
      state.item = product;
    },
    updateProduct(state, action) {
      const product = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === product._id) return product;
        return one;
      });
      state.item = product;
    },
    deleteProduct(state, action) {
      const product = action.payload.data;
      state.items = state.items.filter((one) => one._id !== product._id);
    },
    setProduct(state, action) {
      state.item = action.payload;
    }
  }
});

export const reducer = slice.reducer;

export const getProducts = () => async (dispatch) => {
  const response = await axios.get('/api/product');
  dispatch(slice.actions.getProducts(response.data));
};

export const getProduct = (id) => async (dispatch) => {
  const response = await axios.get('/api/product/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getProduct(response.data));
};

export const addProduct = (product) => async (dispatch) => {
  const response = await axios.post('/api/product/add', {
    product
  });
  dispatch(slice.actions.addProduct(response.data));
};
export const updateProduct = (product) => async (dispatch) => {
  const response = await axios.post('/api/product', {
    product
  });
  dispatch(slice.actions.updateProduct(response.data));
};

export const deleteProduct = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/product/${id}`);
  dispatch(slice.actions.deleteProduct(response.data));
};

export const setProduct = (product) => async (dispatch) => {
  dispatch(slice.actions.setProduct(product));
};

export default slice;
