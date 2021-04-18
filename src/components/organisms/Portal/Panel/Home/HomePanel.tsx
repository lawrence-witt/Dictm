import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { authOperations, authSelectors } from '../../../../../redux/ducks/auth';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    button: {
        margin: `${theme.spacing(1)}px 0`,
        padding: `${theme.spacing(2)}px`,
        borderWidth: 2
    }
}))

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    usersExist: authSelectors.getUsersExist(state.auth.local)
});

const mapDispatch = {
    pushPanel: authOperations.pushAuthPanel
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const HomePanel: React.FC<ReduxProps> = (props) => {
    const {
        usersExist,
        pushPanel
    } = props;

    const classes = useStyles();

    const handleLocalUsers = React.useCallback(() => {
        pushPanel("local");
    }, [pushPanel]);

    const handleNewUser = React.useCallback(() => {
        pushPanel("new")
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
                disabled={!usersExist}
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

export default connector(HomePanel);