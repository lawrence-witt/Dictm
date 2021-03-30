import {
    UserState,
    UserActionTypes,
    USER_LOADED
} from './types';

const initialState: UserState = {
    id: 'user1',
    name: 'Lazarus'
}

const userReducer = (
    state = initialState, 
    action: UserActionTypes
): UserState => {
    switch(action.type) {
        case USER_LOADED:
            return {
                id: action.payload.id,
                name: action.payload.name
            }
        default:
            return state;
    }
}

export default userReducer;