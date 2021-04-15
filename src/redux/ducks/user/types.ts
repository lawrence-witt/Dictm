import User from '../../../db/models/User';

export const USER_LOADED = 'dictm/user/LOADED';

export interface UserState {
    isLoaded: boolean;
    profile: User;
}

interface UserLoadedAction {
    type: typeof USER_LOADED;
    payload: {
        profile: User;
    }
}

export type UserActionTypes = UserLoadedAction;