import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';

const initialState = {
  items: [],
  item: {
    reference_no: '',
    location: '',
    total_amount: 0,
    paid_amount: 0,
    purchase_status: null,
    payment_status: null,
    supplier: null,
    shop: null,
    items: []
  },
  proItems: [],
  proItem: {
    product: null,
    amount: 0,
    purchase_price: 0,
    regular_price: 0,
    sale_price: 0
  }
};

const slice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    getPurchases(state, action) {
      state.items = action.payload.data;
    },
    getPurchase(state, action) {
      const purchase = action.payload;
      state.item = purchase;
    },
    addPurchase(state, action) {
      const purchase = action.payload.data;
      state.items.push(purchase);
      state.item = purchase;
    },
    updatePurchase(state, action) {
      const purchase = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === purchase._id) return purchase;
        return one;
      });
      state.item = purchase;
    },
    deletePurchase(state, action) {
      const purchase = action.payload.data;
      state.items = state.items.filter((one) => one._id !== purchase._id);
    },
    setPurchase(state, action) {
      if (_.isEqual(action.payload, {})) state.item = initialState.item;
      else state.item = action.payload;
      state.proItems = state.item.items.map((i, id) => ({ ...i, id }));
    },
    setProductItem(state, action) {
      let { productItem, mode } = action.payload;
      if (mode === 2) {
        state.proItems = state.proItems.filter((i) => i.id !== productItem.id);
        state.proItems = state.proItems.map((p, index) => ({
          ...p,
          id: index
        }));
      } else if (mode === 0) {
        state.proItems.push(productItem);
      } else if (mode === 1) {
        state.proItems = state.proItems.map((i) => {
          if (i.id === productItem.id) return productItem;
          return i;
        });
      }
      state.proItem = initialState.proItem;
      // state.item = { ...state.item, items: state.proItems };
    },
    setProductItem1(state, action) {
      state.proItem = action.payload;
    }
  }
});

export const reducer = slice.reducer;

export const getPurchases = () => async (dispatch) => {
  const response = await axios.get('/api/purchase');
  dispatch(slice.actions.getPurchases(response.data));
};

export const getPurchase = (id) => async (dispatch) => {
  const response = await axios.get('/api/purchase/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getPurchase(response.data));
};

export const addPurchase = (purchase) => async (dispatch) => {
  const response = await axios.post('/api/purchase/add', {
    purchase
  });
  dispatch(slice.actions.addPurchase(response.data));
};
export const updatePurchase = (purchase) => async (dispatch) => {
  const response = await axios.post('/api/purchase', {
    purchase
  });
  dispatch(slice.actions.updatePurchase(response.data));
};

export const deletePurchase = (id) => async (dispatch) => {
  const response = await axios.delete(
    `/api/purchase/${id}`
  );
  dispatch(slice.actions.deletePurchase(response.data));
};

export const setPurchase = (purchase) => async (dispatch) => {
  dispatch(slice.actions.setPurchase(purchase));
};

export const setProductItem = (productItem, mode) => async (dispatch) => {
  console.log(productItem, 'productItem', mode, 'mode');
  dispatch(slice.actions.setProductItem({ productItem, mode }));
};

export const setProductItem1 = (productItem) => async (dispatch) => {
  console.log(productItem, '********in slice');
  dispatch(slice.actions.setProductItem1(productItem));
};

export default slice;
