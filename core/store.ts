import {AnyAction, applyMiddleware, compose, createStore, Store} from "redux";
import {Context, createWrapper, HYDRATE} from "next-redux-wrapper";
import {Holiday, PharmacyData} from "./types";
import rootReducer from "./reducers";
import {composeWithDevTools} from "redux-devtools-extension";
import {State} from "./reducers/types";


const configureStore = () => {
    const middlewares = [];
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware())
        : composeWithDevTools(
            applyMiddleware(),
        );
    return createStore(rootReducer, enhancer);
    // store.sagaTask = sagaMiddleware.run(rootSaga);
}

const wrapper = createWrapper<Store<State>>(configureStore, {debug: false})

export default wrapper;
