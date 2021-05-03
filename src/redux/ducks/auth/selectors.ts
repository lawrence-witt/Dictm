import { createSelector } from 'reselect';
import { LocalUsersState, NewUserState } from './types';

import { RootState } from '../../store';

import * as helpers from './helpers';

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
    const { previous, current } = history;

    const leftAnimate = { dir: 'left' as const, active: true };
    const rightAnimate = { dir: 'right' as const, active: true };
    const noAnimate = { dir: 'left' as const, active: false};

    const prevSlide = previous && helpers.extractAuthSlide(previous.pathname);
    const currSlide = helpers.extractAuthSlide(current.pathname);

    if (!prevSlide && currSlide) return leftAnimate;
    if (!currSlide && prevSlide) return rightAnimate;

    return noAnimate;
}, animation => animation);

/** 
*  Summary:
*  Detemines when the application can switch between Public and Private routing 
*/

export const getAppLoaded = createSelector((
    app: RootState["auth"]["app"],
    profile: RootState["user"]["profile"]
) => {
    if (!profile) return false;

    return app.transition !== "authenticate";
},  appLoaded => appLoaded);