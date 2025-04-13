import { configureStore } from "@reduxjs/toolkit";
import businessSpaceSlice from "./Businessspaceslice";
 import businessProductSlice from "./businessProductSlice";
export const store = configureStore({
    reducer: {
        businessSpace: businessSpaceSlice,
        businessProduct: businessProductSlice,
    },
});

// Add these type exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;