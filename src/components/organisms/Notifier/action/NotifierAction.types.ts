import { NotificationActions } from '../../../../redux/ducks/notifications';


export interface NotifierActionProps {
    dismiss(): void;
}

export interface NotifierActionSwitchProps {
    type: NotificationActions;
    dismiss(): void;
}