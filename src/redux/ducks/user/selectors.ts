import { createSelector } from 'reselect';

import { RootState } from '../../store';

export const getUserLoaded = createSelector((user: RootState["user"]) => {
    return Boolean(user.profile);
}, isLoaded => isLoaded)