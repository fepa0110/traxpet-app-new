import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: "1234"
    },
    reducers: {
        logIn: (state, action) => {
            console.log(action.payload)
            state.username = action.payload
        },
        //Logout
        //Register
    },
})

// Action creators are generated for each case reducer function
export const { logIn } = userSlice.actions

export default userSlice.reducer