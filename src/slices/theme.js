import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarMode: true
};

const slice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setSidebarMode(state, action) {
      state.sidebarMode = action.payload;
    }
  }
});

export const reducer = slice.reducer;

export const setSidebarMode = (sidebarMode) => async (dispatch) => {
  dispatch(slice.actions.setSidebarMode(sidebarMode));
};

export default slice;
