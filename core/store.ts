import {Store} from "redux";
import {createWrapper} from "next-redux-wrapper";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "./reducers";


const createStore = () => configureStore({
    // @ts-ignore
    reducer: rootReducer,
    // @ts-ignore
    middleware: (getDefaultMiddleware) => {
        // getDefaultMiddleware().concat(logger);
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['pharmacies/filterChanged'],
                ignoredPaths: ['pharmacies.filters.bounds'],
            }
        })
    },
    devTools: process.env.NODE_ENV !== 'production',
})

const wrapper = createWrapper<Store<RootState>>(createStore, {
    debug: process.env.NODE_ENV !== 'production',
})

export default wrapper;
