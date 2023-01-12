import { createSlice } from "@reduxjs/toolkit";

export const publicationSlice = createSlice({
  name: "newPublication",
  initialState: {
    publication: null,
    images: null,
    location: null,
  },
  reducers: {
    setNewPublication: (state, action) => {
      state.publication = action.payload;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setLocations: (state, action) => {
      state.location = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setNewPublication, setImages, setLocation } =
  publicationSlice.actions;

export default publicationSlice.reducer;
