import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import * as reducers from './ducks';

export const history = createBrowserHistory();

const rootReducer = combineReducers({
    router: connectRouter(history),
    ...reducers
})

export type RootState = ReturnType<typeof rootReducer>;

const composeEnhancers = composeWithDevTools({
    serialize: {
        undefined: true
    }
});

const initialState = {};

const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
        applyMiddleware(routerMiddleware(history)),
        applyMiddleware(thunkMiddleware)
    )
);

export default store;