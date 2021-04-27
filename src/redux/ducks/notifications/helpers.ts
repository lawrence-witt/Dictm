import { nanoid } from 'nanoid';

import * as types from './types';

export const generateNotification = (
    persist: boolean,
    variant: types.VariantType,
    message: string[],
    action?: types.NotificationActions
): types.Notification<boolean> => ({
    key: nanoid(5),
    attributes: {
        persist,
        dismissed: false,
        variant
    },
    content: {
        message,
        ...(action ? { action } : {})
    }
})