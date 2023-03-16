import { createSlice } from "@reduxjs/toolkit";

export const publicationSlice = createSlice({
  name: "newPublication",
  initialState: {
    publication: {},
    images: [],
    location: {},
  },
  reducers: {
    setNewPublication: (state, action) => {
      state.publication = action.payload;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    resetNewPublication: (state) => {
      state.publication = {}
      state.images = []
      state.location = {}
    }
  },
});

// Action creators are generated for each case reducer function
export const { setNewPublication, setImages, setLocation, resetNewPublication } =
  publicationSlice.actions;

export default publicationSlice.reducer;
