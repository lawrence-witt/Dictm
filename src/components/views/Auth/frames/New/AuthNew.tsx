import React from 'react';
import { useHistory } from 'react-router-dom';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { authOperations, authSelectors } from '../../../../../redux/ducks/auth';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import FlexSpace from '../../../../atoms/FlexSpace/FlexSpace';
import DirectionButton from '../../../../atoms/Buttons/DirectionButton';

import * as types from './AuthNew.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    name: state.auth.new.name,
    greeting: state.auth.new.greeting,
    canCreateUser: authSelectors.getCanCreateUser(state.auth.new)
});

const mapDispatch = {
    updateNewUser: authOperations.updateNewUser,
    clearNewUser: authOperations.clearNewUser
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(theme => ({
    content: {
        flex: 1
    },
    toolbar: {
        minHeight: 56
    },
    singleMargin: {
        marginBottom: theme.spacing(2)
    }
}))

const AuthNew: React.FC<ReduxProps & types.AuthNewProps> = (props) => {
    const {
        name,
        greeting,
        canCreateUser,
        updateNewUser,
        setCreateMethod,
        clearNewUser
    } = props;

    const history = useHistory();

    const classes = useStyles();

    const handleGoBack = React.useCallback(() => {
        history.push('/auth');
    }, [history]);

    const handleFieldChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.name !== "name" && ev.target.name !== "greeting") return;
        updateNewUser(ev.target.name, ev.target.value);
    }, [updateNewUser]);

    React.useEffect(() => {
        return () => clearNewUser();
    }, [clearNewUser]);

    return (
        <>
            <div className={classes.content}>
                <Toolbar 
                    disableGutters
                    className={classes.toolbar}
                >
                        <Typography 
                            variant="h6"
                        >
                            Create New User
                        </Typography>
                </Toolbar>
                <TextField
                    required
                    label="Name"
                    name="name"
                    value={name}
                    fullWidth
                    className={classes.singleMargin}
                    onChange={handleFieldChange}
                />
                <TextField
                    label="Greeting"
                    name="greeting"
                    value={greeting}
                    fullWidth
                    onChange={handleFieldChange}
                />
            </div>
            <Toolbar
                disableGutters
            >
                <DirectionButton
                    edge="start"
                    design="arrow" 
                    direction="left"
                    onClick={handleGoBack}
                />
                <FlexSpace />
                <Button
                    variant="outlined"
                    onClick={setCreateMethod}
                    disabled={!canCreateUser}
                >
                    Get Started
                </Button>
            </Toolbar>
        </>
    )
}

export default connector(AuthNew);