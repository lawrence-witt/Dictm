import { createStore, applyMiddleware, combineReducers, Action } from 'redux';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as reducers from './ducks';

const initialState = {};
const rootReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof rootReducer>;

export type ThunkResult<R> = ThunkAction<R, RootState, null, Action>;

const composeEnhancers = composeWithDevTools({
    serialize: {
        undefined: true
    }
});

const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(thunkMiddleware)
));

export default store;