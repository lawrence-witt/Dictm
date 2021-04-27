import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import * as types from './NotifierMessage.types';

const useStyles = makeStyles<Theme, {length: number}>(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        "& div:first-child": {
            "&::after": {
                content: "''",
                display: 'block',
                height: ({length}) => length === 2 ? theme.spacing(1) : 0
            }
        },
        "& div:not(:first-child):not(:last-child)": {
            padding: ({length}) => length > 2 ? `${theme.spacing(1)}px 0px` : 0
        }
    }
}))

const NotifierMessage: React.FC<types.NotifierMessageProps> = (props) => {
    const {
        message,
        dismiss: d
    } = props;

    const { root } = useStyles({length: message.length});

    const dismiss = React.useCallback(() => d && d(), [d]);

    return (
        <div className={root} onClick={dismiss}>
            {message.map((line, i) => (
                <div key={i}>
                    {line}
                </div>
            ))}
        </div>
    )
}

export default NotifierMessage;