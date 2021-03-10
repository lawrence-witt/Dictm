import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './ducks';

const initialState = {};
const rootReducer = combineReducers(reducers);

const composeEnhancers = composeWithDevTools({
    serialize: {
        undefined: true
    }
});

const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(thunkMiddleware)
));

export default store;