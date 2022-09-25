import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';

const initialState = {
  items: [],
  item: {
    invoice_no: '',
    date: null,
    // from: {
    //   shop: {},
    //   store: {},
    //   supplier: {}
    // },
    // to: {
    //   shop: {},
    //   store: {},
    //   customer: {}
    // },
    from_shop: {},
    from_store: {},
    from_supplier: {},
    to_shop: {},
    to_store: {},
    to_customer: {},
    status: {
      value: 0,
      label: ''
    },
    total_amount: 0,
    shipping_charge: 0,
    note: ''
  }
};

const slice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    getTransfers(state, action) {
      state.items = action.payload.data;
    },
    getTransfer(state, action) {
      const transfer = action.payload;
      state.item = state.items.map((one) => one._id === transfer._id);
    },
    addTransfer(state, action) {
      const transfer = action.payload.data;
      state.items.push(transfer);
      state.item = {
        ...transfer,
        from_shop: _.get(transfer, 'from.shop'),
        from_store: _.get(transfer, 'from.store'),
        from_supplier: _.get(transfer, 'from.supplier'),
        to_shop: _.get(transfer, 'to.shop'),
        to_store: _.get(transfer, 'to.store'),
        to_customer: _.get(transfer, 'to.customer')
      };
    },
    updateTransfer(state, action) {
      const transfer = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === transfer._id) return transfer;
        return one;
      });
      state.item = {
        ...transfer,
        from_shop: _.get(transfer, 'from.shop'),
        from_store: _.get(transfer, 'from.store'),
        from_supplier: _.get(transfer, 'from.supplier'),
        to_shop: _.get(transfer, 'to.shop'),
        to_store: _.get(transfer, 'to.store'),
        to_customer: _.get(transfer, 'to.customer')
      };
    },
    deleteTransfer(state, action) {
      const transfer = action.payload.data;
      state.items = state.items.filter((one) => one._id !== transfer._id);
    },
    setTransfer(state, action) {
      state.item = action.payload;
    }
  }
});

export const reducer = slice.reducer;

export const getTransfers = () => async (dispatch) => {
  const response = await axios.get('/api/transfer');
  dispatch(slice.actions.getTransfers(response.data));
};

export const getTransfer = (id) => async (dispatch) => {
  const response = await axios.get('/api/transfer/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getTransfer(response.data));
};

export const addTransfer = (transfer) => async (dispatch) => {
  transfer = {
    ...transfer,
    from: {
      shop: transfer.from_shop,
      store: transfer.from_store,
      supplier: transfer.from_supplier
    },
    to: {
      shop: transfer.to_shop,
      store: transfer.to_store,
      customer: transfer.to_customer
    }
  };
  const response = await axios.post('/api/transfer/add', {
    transfer
  });
  dispatch(slice.actions.addTransfer(response.data));
};
export const updateTransfer = (transfer) => async (dispatch) => {
  const response = await axios.post('/api/transfer', {
    transfer
  });
  dispatch(slice.actions.updateTransfer(response.data));
};

export const deleteTransfer = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/transfer/${id}`);
  dispatch(slice.actions.deleteTransfer(response.data));
};

export const setTransfer = (transfer) => async (dispatch) => {
  transfer = {
    ...transfer,
    from_shop: _.get(transfer, 'from.shop'),
    from_store: _.get(transfer, 'from.store'),
    from_supplier: _.get(transfer, 'from.supplier'),
    to_shop: _.get(transfer, 'to.shop'),
    to_store: _.get(transfer, 'to.store'),
    to_customer: _.get(transfer, 'to.customer')
  };
  dispatch(slice.actions.setTransfer(transfer));
};

export default slice;
