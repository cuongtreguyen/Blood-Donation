import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      // mong muốn nó lưu vào store
      return action.payload;
    },
    logout() {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = userSlice.actions;

export default userSlice.reducer;