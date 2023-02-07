import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
    },
    reducers: {
        logIn: (state, action) => {
            state.id = action.payload.id
            state.username = action.payload.username
            state.email = action.payload.email
            state.rol = action.payload.rol
        },
        logOut: (state) => {
            state = {}
            // state.username = action.payload.username
            // state.email = action.payload.email
            // state.rol = action.payload.rol
        }
        //Register
    },
})

// Action creators are generated for each case reducer function
export const { logIn ,logOut} = userSlice.actions

export default userSlice.reducer