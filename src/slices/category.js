import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  item: {
    parent: '',
    name: '',
    description: '',
    children: [],
    child: {
      parent: '',
      name: '',
      description: ''
    }
  }
};

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    getCategories(state, action) {
      state.items = action.payload.data;
    },
    getCategory(state, action) {
      const category = action.payload;
      state.item = state.items.map((one) => one._id === category._id);
    },
    addCategory(state, action) {
      const category = action.payload.data;
      state.items.push(category);
    },
    updateCategory(state, action) {
      const category = action.payload.data;
      state.items = state.items.map((one) => {
        if (one._id === category._id) return category;
        return one;
      });
    },
    deleteCategory(state, action) {
      const category = action.payload.data;
      state.items = state.items.filter((one) => one._id !== category._id);
    },

    setCategory(state, action) {
      console.log(action.payload, '----------setCategory');
      state.item = action.payload;
    }
  }
});

export const reducer = slice.reducer;

export const getCategories = () => async (dispatch) => {
  const response = await axios.get('/api/category');
  dispatch(slice.actions.getCategories(response.data));
};

export const getCategory = (id) => async (dispatch) => {
  const response = await axios.get('/api/category/:id', {
    params: {
      id
    }
  });
  dispatch(slice.actions.getCategory(response.data));
};

export const addCategory = (category) => async (dispatch) => {
  category = category.child;
  const response = await axios.post('/api/category/add', {
    category
  });
  dispatch(slice.actions.addCategory(response.data));
};
export const updateCategory = (category) => async (dispatch) => {
  // console.log(category, '------first cateoty');
  // if (category._id)
  //   category = {
  //     ...category,
  //     children: [...category.children, category.child]
  //   };
  console.log(category, '-------caege in slice update');
  const response = await axios.post('/api/category', {
    category
  });
  dispatch(slice.actions.updateCategory(response.data));
};

export const deleteCategory = (id) => async (dispatch) => {
  const response = await axios.delete(`/api/category/${id}`);
  dispatch(slice.actions.deleteCategory(response.data));
};

export const setCategory = (category) => async (dispatch) => {
  dispatch(slice.actions.setCategory(category));
};

export default slice;
