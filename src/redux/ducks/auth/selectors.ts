import { createSelector } from 'reselect';
import { LocalUsersState, NewUserState } from './types';

import { RootState } from '../../store';

/** 
*  Summary:
*  Checks whether any local users have been found for this device.
*/

export const getUsersExist = createSelector((
    localUsers: LocalUsersState
) => {
    if (localUsers.isLoaded && localUsers.allIds.length > 0) return true;
    return false;
}, flag => flag);

/** 
*  Summary:
*  Selects the local user state by name.
*/

export const getUsersByName = createSelector((
    usersById: LocalUsersState["byId"],
    userIds: LocalUsersState["allIds"]
) => {
    return userIds.map(id => ({
        id,
        name: usersById[id].attributes.name
    }));
}, users => users);

/**
*  Summary:
*  Checks that the new user form is valid.
*/

export const getCanCreateUser = createSelector((
    newUser: NewUserState
) => {
    if (!newUser.name || newUser.name.length < 1) return false;
    return true;
}, flag => flag);

/** 
*  Summary:
*  Determines the animation activity and direction for the next Auth frame.
*/

export const getAuthAnimation = createSelector((
    history: RootState["history"]
) => {
    return null;
}, animation => animation);