import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { useHistory } from 'react-router-dom';

import { RootState } from '../../../../../redux/store';
import { authSelectors } from '../../../../../redux/ducks/auth';

import Toolbar from '@material-ui/core/Toolbar';
import ToolTip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Home from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
    },
    button: {
        margin: `${theme.spacing(1)}px 0`,
        padding: `${theme.spacing(2)}px`,
        borderWidth: 2,
        '&:disabled': {
            borderWidth: 2
        }
    },
    disabled: {}
}))

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    usersExist: authSelectors.getUsersExist(state.auth.local)
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const AuthHome: React.FC<ReduxProps> = (props) => {
    const {
        usersExist
    } = props;

    const classes = useStyles();

    const history = useHistory();

    const handleLeaveAuth = React.useCallback(() => {
        history.push('/');
    }, [history]);

    const handleLocalUsers = React.useCallback(() => {
        history.push('/auth/local');
    }, [history]);

    const handleNewUser = React.useCallback(() => {
        history.push('/auth/new');
    }, [history]);

    return (
        <>
            <div className={classes.content}>
                <ToolTip
                    title="Cloud storage coming soon!"
                    placement="top"
                    arrow
                    enterTouchDelay={0}
                >
                    <Button
                        color="primary"
                        variant="contained"
                        disableElevation
                        className={classes.button}
                    >
                        Sign In
                    </Button>
                </ToolTip>
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
            </div>
            <Toolbar
                disableGutters
            >
                <IconButton
                    edge="start"
                    onClick={handleLeaveAuth}
                >
                    <Home/>
                </IconButton> 
            </Toolbar>
        </>
    )
}

export default connector(AuthHome);