import React from 'react';
import { useSnackbar } from 'notistack';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { notificationsOperations } from '../../../redux/ducks/notifications';

import NotifierMessage from './message/NotifierMessage';
import NotifierAction from './action/NotifierAction';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    notifications: state.notifications
});

const mapDispatch = {
    dismissNotification: notificationsOperations.dismissNotification,
    removeNotification: notificationsOperations.removeNotification
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const Notifier: React.FC<ReduxProps> = (props) => {
    const {
        notifications,
        dismissNotification,
        removeNotification
    } = props;

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const displayed = React.useRef<string[]>([])

    React.useEffect(() => {
        notifications.allKeys.forEach(key => {
            const { attributes, content } = notifications.byKey[key];

            const { persist, dismissed, variant } = attributes;
            const { message, action } = content;

            if (dismissed) {
                closeSnackbar(key);
                return;
            }

            if (displayed.current.includes(key)) return;

            const dismiss = () => dismissNotification(key);
            const messageDismiss = () => persist ? undefined : dismiss();

            enqueueSnackbar(<NotifierMessage message={message} dismiss={messageDismiss}/>, {
                key,
                persist,
                variant,
                onExited: (_, exitedKey) => {
                    if (typeof exitedKey !== "string") return;
                    removeNotification(exitedKey);
                    displayed.current = displayed.current.filter(key => key !== exitedKey);
                },
                ...(action ? { 
                    action: <NotifierAction type={action} dismiss={dismiss} /> 
                } : {})
            })

            displayed.current.push(key);
        })
    }, [notifications, dismissNotification, removeNotification, enqueueSnackbar, closeSnackbar]);

    return null;
}

export default connector(Notifier);