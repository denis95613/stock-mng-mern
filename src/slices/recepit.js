import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  item: {}
};

const slice = createSlice({
  name: 'recepit',
  initialState,
  reducers: {
    getRecepits(state, action) {
      state.items = action.payload.data;
    },
    getRecepit(state, action) {
      const recepit = action.payload;
      state.item = state.items.map((one) => one._id === recepit._id);
    },
    addRecepit(state, action) {
      const recepit = action.payload.data;
      state.items.push(recepit);
    },
    updateRecepit(state, action) {
      const recepit = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === recepit._id) return recepit;
        return one;
      });
    },
    deleteRecepit(state, action) {
      const recepit = action.payload.data;
      state.items = state.items.filter((one) => one._id !== recepit._id);
    },
    setRecepit(state, action) {
      state.item = action.payload;
    }
  }
});

export const reducer = slice.reducer;

export const getRecepits = () => async (dispatch) => {
  const response = await axios.get('/api/recepit');
  dispatch(slice.actions.getRecepits(response.data));
};

export const getRecepit = (id) => async (dispatch) => {
  const response = await axios.get('/api/recepit/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getRecepit(response.data));
};

export const addRecepit = (recepit) => async (dispatch) => {
  console.log(recepit, '------recepit in slice');
  recepit = {
    ...recepit,
    items: recepit.items.map((i) => ({
      ...i,
      store: i.store._id,
      product: i.product._id
    }))
  };
  console.log(recepit, '------tmp in slice');
  const response = await axios.post('/api/recepit/add', {
    recepit
  });
  dispatch(slice.actions.addRecepit(response.data));
};
export const updateRecepit = (recepit) => async (dispatch) => {
  const response = await axios.post('/api/recepit', {
    recepit
  });
  dispatch(slice.actions.updateRecepit(response.data));
};

export const deleteRecepit = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/recepit/${id}`);
  dispatch(slice.actions.deleteRecepit(response.data));
};

export const setRecepit = (recepit) => async (dispatch) => {
  dispatch(slice.actions.setRecepit(recepit));
};

export default slice;
