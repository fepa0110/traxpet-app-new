import { createSlice } from '@reduxjs/toolkit'

export const publicationSlice = createSlice({
    name: 'newPublication',
    initialState: {
    },
    reducers: {
        setNewPublication: (state, action) => {
            state = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setNewPublication } = publicationSlice.actions

export default publicationSlice.reducer