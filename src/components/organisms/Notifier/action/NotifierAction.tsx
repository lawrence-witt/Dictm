import React from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';

import * as types from './NotifierAction.types';

const NotificationButton: React.FC<ButtonProps> = ({children, ...rest}) => {
    return <Button variant="outlined" color="inherit" {...rest}>{children}</Button>
}

const ReloadAction: React.FC = () => {
    const reload = React.useCallback(() => window.location.reload(), []);

    return <NotificationButton onClick={reload}>RELOAD</NotificationButton>
}

const NotifierAction: React.FC<types.NotifierActionSwitchProps> = (props) => {
    const {
        type
    } = props;

    //const dismiss = React.useCallback(() => d(), [d]);

    switch(type) {
        case "RELOAD": return <ReloadAction/>;
        default: return null;
    }
}

export default NotifierAction;