import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  item: {}
};

const slice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    getSuppliers(state, action) {
      state.items = action.payload.data;
    },
    getSupplier(state, action) {
      const supplier = action.payload;
      state.item = state.items.map((one) => one._id === supplier._id);
    },
    addSupplier(state, action) {
      const supplier = action.payload.data;
      state.items.push(supplier);
    },
    updateSupplier(state, action) {
      const supplier = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === supplier._id) return supplier;
        return one;
      });
    },
    deleteSupplier(state, action) {
      const supplier = action.payload.data;
      state.items = state.items.filter((one) => one._id !== supplier._id);
    }
  }
});

export const reducer = slice.reducer;

export const getSuppliers = () => async (dispatch) => {
  const response = await axios.get('/api/supplier');
  dispatch(slice.actions.getSuppliers(response.data));
};

export const getSupplier = (id) => async (dispatch) => {
  const response = await axios.get('/api/supplier/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getSupplier(response.data));
};

export const addSupplier = (supplier) => async (dispatch) => {
  const response = await axios.post('/api/supplier/add', {
    supplier
  });
  dispatch(slice.actions.addSupplier(response.data));
};
export const updateSupplier = (supplier) => async (dispatch) => {
  const response = await axios.post('/api/supplier', {
    supplier
  });
  dispatch(slice.actions.updateSupplier(response.data));
};

export const deleteSupplier = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/supplier/${id}`);
  dispatch(slice.actions.deleteSupplier(response.data));
};

export default slice;
