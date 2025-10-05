import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  // Add other UI state properties here
}

const initialState: UIState = {
  darkMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    // Add other reducers here
  },
});

export const { toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
