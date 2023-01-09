import { configureStore } from '@reduxjs/toolkit'
import publicationReducer from './slices/publicationSlice'
import userReducer from './slices/userSlice'

export default configureStore({
    reducer: {
        user: userReducer,
        newPublication: publicationReducer,
    },
})