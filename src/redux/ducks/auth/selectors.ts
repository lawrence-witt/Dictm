import { createSelector } from 'reselect';
import { LocalUsersState, NewUserState } from './types';

export const getUsersExist = createSelector((
    localUsers: LocalUsersState
) => {
    if (localUsers.isLoaded && localUsers.allIds.length > 0) return true;
    return false;
}, flag => flag);

export const getUsersByName = createSelector((
    usersById: LocalUsersState["byId"],
    userIds: LocalUsersState["allIds"]
) => {
    return userIds.map(id => ({
        id,
        name: usersById[id].attributes.name
    }));
}, users => users);

export const getCanLoadUser = createSelector((
    selectedId: LocalUsersState["selectedId"]
) => {
    return Boolean(selectedId);
}, flag => flag);

export const getCanCreateUser = createSelector((
    newUser: NewUserState
) => {
    if (!newUser.name || newUser.name.length < 1) return false;
    return true;
}, flag => flag);