import * as types from './types';

export const addNotification = (
    notification: types.Notification<boolean>
): types.AddNotificationAction => ({
    type: types.NOTIFICATION_ADDED,
    payload: {
        notification
    }
});

export const dismissNotification = (
    key: string
): types.DismissNotificationAction => ({
    type: types.NOTIFICATION_DISMISSED,
    payload: {
        key
    }
});

export const removeNotification = (
    key: string
): types.RemoveNotificationAction => ({
    type: types.NOTIFICATION_REMOVED,
    payload: {
        key
    }
});

export const clearNotifications = (): types.ClearNotificationsAction => ({
    type: types.NOTIFICATIONS_CLEARED
});