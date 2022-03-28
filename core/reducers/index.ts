// import {FILTER_CHANGED, ITEM_SELECTED, RECEIVE_DATA, SORT_CHANGED} from "./action";
// import {State} from "./types";
// import {HYDRATE} from "next-redux-wrapper";
// import {AnyAction} from "redux";
// import {sortWithDistance} from "../mapManager/helpers";
//
// export const initialState: State = {pharmacies: [], filters: {bounds: null, showClosed: true, isHoliday: false}};
//
// const appReducer = (state=initialState, action: AnyAction) => {
//     let nextState;
//     switch (action.type) {
//         case HYDRATE:
//             nextState = {
//                 ...state,
//                 ...action.payload,
//             };
//             if (state.pharmacies.length) {
//                 nextState.pharmacies = state.pharmacies
//             }
//             return nextState;
//         case RECEIVE_DATA:
//             return {
//                 ...state,
//                 pharmacies: action.payload,
//             }
//         case FILTER_CHANGED:
//             nextState = {...state};
//             const originBounds = nextState.filters.bounds;
//             const newBounds = action.payload.bounds;
//
//             if (newBounds) {
//                 if (originBounds && originBounds.equals(newBounds)) {
//
//                 } else {
//                     nextState.pharmacies = sortWithDistance(nextState.pharmacies, action.payload.bounds.getCenter());
//                 }
//             }
//             return {
//                 ...nextState,
//                 filters: {
//                     ...state.filters,
//                     ...action.payload,
//                 }
//             }
//         case SORT_CHANGED:
//             const newState = {...state};
//             switch (action.payload) {
//                 case 'distanceAsc':
//                     if (newState.filters.bounds) {
//                         newState.pharmacies = sortWithDistance(newState.pharmacies, newState.filters.bounds.getCenter());
//                     }
//                     break;
//                 case 'nameAsc':
//                     newState.pharmacies = newState.pharmacies.sort((a, b) => (
//                         a.name > b.name ? 1 : a.name < b.name ? -1 : 0
//                     ))
//                     break;
//             }
//             return newState;
//         case ITEM_SELECTED:
//             const selected = state.pharmacies.find(row => row.id === action.payload);
//             return {
//                 ...state,
//                 selected: selected,
//             }
//         default:
//             return state;
//     }
// };
//
// export default appReducer;

import {HYDRATE} from "next-redux-wrapper";
import {combineReducers, CombinedState, AnyAction} from "@reduxjs/toolkit";
import pharmaciesReducer from "./pharmacies";
import selectorReducer from "./selector";
import { CombinedStateType } from "./types";

const combinedReducer = combineReducers({
    pharmacies: pharmaciesReducer,
    selector: selectorReducer,
});

const rootReducer = (state: CombinedState<CombinedStateType>, action: AnyAction): ReturnType<typeof combinedReducer> => {
    if (action.type === HYDRATE) {
        return {...state, ...action.payload};
    }
    return combinedReducer(state, action);
}

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;