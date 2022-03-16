import {FILTER_CHANGED, RECEIVE_DATA} from "./action";
import {State} from "./types";
import {HYDRATE} from "next-redux-wrapper";
import {AnyAction} from "redux";

export const initialState: State = {pharmacies: [], filters: {bounds: null, showClosed: true, isHoliday: false}};

const appReducer = (state=initialState, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            const nextState = {
                ...state,
                ...action.payload,
            };
            if (state.pharmacies.length) {
                nextState.pharmacies = state.pharmacies
            }
            return nextState;
        case RECEIVE_DATA:
            return {
                ...state,
                pharmacies: action.payload,
            }
        case FILTER_CHANGED:
            console.log(action.payload)
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...action.payload,
                }
            }
        default:
            return state;
    }
};

export default appReducer;