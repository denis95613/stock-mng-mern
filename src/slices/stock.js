import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';

const initialState = {
  items: [],
  item: {
    shop: {
      _id: undefined,
      name: ''
    },
    store: {
      _id: undefined,
      name: ''
    },
    product: {
      _id: undefined,
      name: ''
    },
    quantity: 0,
    limit_quantity: 0,
    purchase_price: 0,
    regular_price: 0,
    sale_price: 0,
    discount: 0
  },
  stores: []
};

const slice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    getStocks(state, action) {
      state.items = action.payload.data;
    },
    getStocksByShop(state, action) {
      state.items = action.payload.data;
    },
    getStoresByProducts(state, action) {
      state.stores = action.payload.data;
    },
    getStock(state, action) {
      const stock = action.payload;
      state.item = state.items.map((one) => one._id === stock._id);
    },
    addStock(state, action) {
      const stock = action.payload.data;
      state.items.push(stock);
      state.item = stock;
    },
    updateStock(state, action) {
      const stock = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === stock._id) return stock;
        return one;
      });
      state.item = stock;
    },
    deleteStock(state, action) {
      const stock = action.payload.data;
      state.items = state.items.filter((one) => one._id !== stock._id);
    },
    setStock(state, action) {
      if (_.isEqual(action.payload, {})) state.item = initialState.item;
      else state.item = action.payload;
    },
    setStockStores(state, action) {
      state.stores = action.payload;
    }
  }
});

export const reducer = slice.reducer;

export const getStocks = () => async (dispatch) => {
  const response = await axios.get('/api/stock');
  dispatch(slice.actions.getStocks(response.data));
};

export const getStocksByShop = (id) => async (dispatch) => {
  const response = await axios.get(`/api/stock/${id}`);
  dispatch(slice.actions.getStocksByShop(response.data));
};

export const getStoresByProducts = (products) => async (dispatch) => {
  const response = await axios.post(`/api/stock/stores`, {
    products
  });
  dispatch(slice.actions.getStoresByProducts(response.data));
};

export const getStock = (id) => async (dispatch) => {
  const response = await axios.get('/api/stock/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getStock(response.data));
};

export const addStock = (stock) => async (dispatch) => {
  const response = await axios.post('/api/stock/add', {
    stock
  });
  dispatch(slice.actions.addStock(response.data));
};
export const updateStock = (stock) => async (dispatch) => {
  const response = await axios.post('/api/stock', {
    stock
  });
  dispatch(slice.actions.updateStock(response.data));
};

export const deleteStock = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/stock/${id}`);
  dispatch(slice.actions.deleteStock(response.data));
};

export const setStock = (stock) => async (dispatch) => {
  dispatch(slice.actions.setStock(stock));
};

export const setStockStores = (stores) => async (dispatch) => {
  dispatch(slice.actions.setStockStores(stores));
};

export default slice;
