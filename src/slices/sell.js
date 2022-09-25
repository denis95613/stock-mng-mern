import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  item: {
    invoice_no: '',
    customer: {},
    contact: '',
    shop: {},
    payment_status: {},
    payment_method: {},
    total_amount: 0,
    paid_amount: 0,
    sell_due: 0,
    sell_return_due: 0,
    // shipping_status: 0,
    items: [],
    sell_note: '',
    stuf_note: '',
    shipping_note: ''
  }
};

const slice = createSlice({
  name: 'sell',
  initialState,
  reducers: {
    getSells(state, action) {
      state.items = action.payload.data;
    },
    getSell(state, action) {
      const sell = action.payload;
      state.item = state.items.map((one) => one._id === sell._id);
    },
    addSell(state, action) {
      const sell = action.payload.data;
      state.items.push(sell);
      state.item = sell;
    },
    updateSell(state, action) {
      const sell = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === sell._id) return sell;
        return one;
      });
      state.item = sell;
    },
    deleteSell(state, action) {
      const sell = action.payload.data;
      state.items = state.items.filter((one) => one._id !== sell._id);
    },
    setSell(state, action) {
      state.item = action.payload;
    }
  }
});

export const reducer = slice.reducer;

export const getSells = () => async (dispatch) => {
  const response = await axios.get('/api/sell');
  dispatch(slice.actions.getSells(response.data));
};

export const getSell = (id) => async (dispatch) => {
  const response = await axios.get('/api/sell/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getSell(response.data));
};

export const addSell = (sell) => async (dispatch) => {
  console.log(sell, '---sell in slice');
  const response = await axios.post('/api/sell/add', {
    sell
  });
  dispatch(slice.actions.addSell(response.data));
};
export const updateSell = (sell) => async (dispatch) => {
  const response = await axios.post('/api/sell', { sell });
  dispatch(slice.actions.updateSell(response.data));
};

export const deleteSell = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/sell/${id}`);
  dispatch(slice.actions.deleteSell(response.data));
};

export const setSell = (sell) => async (dispatch) => {
  dispatch(slice.actions.setSell(sell));
};

export default slice;
