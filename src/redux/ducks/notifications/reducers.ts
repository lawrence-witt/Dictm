import * as types from './types';

const initialNotificationsState: types.NotificationsState = {
    byKey: {},
    allKeys: []
}

const notificationsReducer = (
    state = initialNotificationsState,
    action: types.NotificationsActions
): types.NotificationsState => {
    switch(action.type) {
        case types.NOTIFICATION_ADDED: {
            const { notification } = action.payload;
            return {
                byKey: {
                    ...state.byKey, 
                    [notification.key]: notification 
                },
                allKeys: [...state.allKeys, notification.key]
            }
        }
        case types.NOTIFICATION_DISMISSED: {
            const { key } = action.payload;

            if (!state.byKey[key]) return state;

            return {
                ...state,
                byKey: {
                    ...state.byKey, 
                    [key]: {
                        ...state.byKey[key],
                        attributes: {
                            ...state.byKey[key].attributes,
                            dismissed: true
                        }
                    }
                }
            }
        }
        case types.NOTIFICATION_REMOVED: {
            const { key } = action.payload;

            return {
                byKey: (bk => {
                    delete bk[key]; 
                    return bk 
                })({...state.byKey}),
                allKeys: state.allKeys.filter(k => k !== key)
            };
        }
        case types.NOTIFICATIONS_CLEARED:
            return initialNotificationsState;
        default:
            return state;
    }
}

export default notificationsReducer;