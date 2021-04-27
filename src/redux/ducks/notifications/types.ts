import { VariantType } from 'notistack'

/* Notification Types */

export type NotificationActions =
|   "RELOAD";

export type Notification<Persist extends boolean> = {
    key: string;
    attributes: {
        persist: Persist;
        dismissed: boolean;
        variant: VariantType;
    };
    content: {
        message: string[];
    } & (Persist extends true ? {
        action: NotificationActions;
    } : {
        action?: NotificationActions;
    });
}

export { VariantType };

/* Reducer Types */

export const NOTIFICATION_ADDED     = "dictm/notifications/NOTIFICATION_ADDED";
export const NOTIFICATION_DISMISSED = "dictm/notifications/NOTIFICATION_DISMISSED";
export const NOTIFICATION_REMOVED   = "dictm/notifications/NOTIFICATION_REMOVED";

export interface NotificationsState {
    byKey: Record<string, Notification<boolean>>;
    allKeys: string[];
}

export interface AddNotificationAction {
    type: typeof NOTIFICATION_ADDED;
    payload: {
        notification: Notification<boolean>;
    }
}

export interface DismissNotificationAction {
    type: typeof NOTIFICATION_DISMISSED;
    payload: {
        key: string;
    }
}

export interface RemoveNotificationAction {
    type: typeof NOTIFICATION_REMOVED;
    payload: {
        key: string;
    }
}

export type NotificationsActions =
|   AddNotificationAction
|   DismissNotificationAction
|   RemoveNotificationAction;