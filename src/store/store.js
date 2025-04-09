import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/features';

export const store = configureStore({
    reducer: {
       user: authReducer,
    }
});
