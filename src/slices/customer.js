import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  item: {}
};

const slice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    getCustomers(state, action) {
      state.items = action.payload.data;
    },
    getCustomer(state, action) {
      const customer = action.payload;
      state.item = state.items.map((one) => one._id === customer._id);
    },
    addCustomer(state, action) {
      const customer = action.payload.data;
      state.items.push(customer);
    },
    updateCustomer(state, action) {
      const customer = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === customer._id) return customer;
        return one;
      });
    },
    deleteCustomer(state, action) {
      const customer = action.payload.data;
      state.items = state.items.filter((one) => one._id !== customer._id);
    }
  }
});

export const reducer = slice.reducer;

export const getCustomers = () => async (dispatch) => {
  const response = await axios.get('/api/customer');
  dispatch(slice.actions.getCustomers(response.data));
};

export const getCustomer = (id) => async (dispatch) => {
  const response = await axios.get('/api/customer/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getCustomer(response.data));
};

export const addCustomer = (customer) => async (dispatch) => {
  const response = await axios.post('/api/customer/add', {
    customer
  });
  dispatch(slice.actions.addCustomer(response.data));
};
export const updateCustomer = (customer) => async (dispatch) => {
  const response = await axios.post('/api/customer', {
    customer
  });
  dispatch(slice.actions.updateCustomer(response.data));
};

export const deleteCustomer = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/customer/${id}`);
  dispatch(slice.actions.deleteCustomer(response.data));
};

export default slice;
