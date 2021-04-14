import React from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import * as types from './HomePanel.types';

const useStyles = makeStyles(theme => ({
    button: {
        margin: `${theme.spacing(1)}px 0`,
        padding: `${theme.spacing(2)}px`,
        borderWidth: 2
    }
}))

const HomePanel: React.FC<types.HomePanelProps> = (props) => {
    const {
        pushPanel
    } = props;

    const classes = useStyles();

    const handleLocalUsers = React.useCallback(() => {
        pushPanel("localUsers");
    }, [pushPanel]);

    const handleNewUser = React.useCallback(() => {
        pushPanel("newUser")
    }, [pushPanel]);

    return (
        <>
            <Button
                color="primary"
                variant="contained"
                disableElevation
                className={classes.button}
            >
                Sign In
            </Button>
            <Button
                variant="outlined"
                onClick={handleLocalUsers}
                className={classes.button}
            >
                Local Users
            </Button>
            <Button
                variant="outlined"
                onClick={handleNewUser}
                className={classes.button}
            >
                Create User
            </Button>
        </>
    )
}

export default HomePanel;