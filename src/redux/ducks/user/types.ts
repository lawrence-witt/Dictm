export const USER_LOADED = 'dictm/user/USER_LOADED';

export interface UserState {
    id: string;
    name: string;
}

interface UserLoadedAction {
    type: typeof USER_LOADED;
    payload: {
        id: string;
        name: string;
    }
}

export type UserActionTypes = UserLoadedAction;