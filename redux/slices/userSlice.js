import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: 0,
        username: ""
    },
    reducers: {
        logIn: (state, action) => {
            // console.log(action.payload)
            state.id = action.payload.id
            state.username = action.payload.username
        },
        //Logout
        //Register
    },
})

// Action creators are generated for each case reducer function
export const { logIn } = userSlice.actions

export default userSlice.reducer