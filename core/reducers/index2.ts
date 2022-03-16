// import {AnyAction, combineReducers} from "redux";
// import pharmaciesReducer from './reducer';
// import holidaysReducer from './holidays/reducer';
// import {HYDRATE} from "next-redux-wrapper";
// import {State} from "../store";
// import {REQUEST_DATA} from "./action";
//
// const combinedReducer = combineReducers({
//     pharmacies: pharmaciesReducer,
// })
// export type RootReducerType = ReturnType<typeof rootReducer>;
//
// const rootReducer = (state: State = {pharmacies: []}, action: AnyAction) => {
//     switch (action.type) {
//         case HYDRATE:
//             const nextState = {
//                 ...state,
//                 ...action.payload,
//             };
//             if (state.pharmacies.length) {
//                 nextState.pharmacies = state.pharmacies
//             }
//             return nextState
//         default:
//             // @ts-ignore
//             return combinedReducer(state, action);
//     }
// }
// export default rootReducer;