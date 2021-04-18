import React from 'react';
import { useHistory } from 'react-router-dom';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { authOperations, authSelectors } from '../../../../../redux/ducks/auth';

import Toolbar from '@material-ui/core/Toolbar';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import { makeStyles, Typography } from '@material-ui/core';

import FlexSpace from '../../../../atoms/FlexSpace/FlexSpace';
import DirectionButton from '../../../../atoms/Buttons/DirectionButton';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    selectedUser: state.auth.local.selectedId,
    usersByName: authSelectors.getUsersByName(
        state.auth.local.byId, 
        state.auth.local.allIds
    )
});

const mapDispatch = {
    selectLocalUser: authOperations.selectLocalUser,
    loadUser: authOperations.loadSelectedUser
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(theme => ({
    container: {
        //
    },
    toolbar: {
        minHeight: 56
    },
    label: {
        margin: 'unset'
    },
    radio: {
        paddingLeft: 'unset',
        marginRight: theme.spacing(1)
    }
}))

const AuthLocal: React.FC<ReduxProps> = (props) => {
    const {
        selectedUser,
        usersByName,
        selectLocalUser,
        loadUser
    } = props;

    const classes = useStyles();

    const history = useHistory();

    const handleGoBack = React.useCallback(() => {
        history.push('/auth');
    }, [history]);

    const handleUserChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        selectLocalUser(ev.target.value);
    }, [selectLocalUser]);

    return (
        <>        
            <div className={classes.container}>
                <Toolbar 
                    disableGutters
                    className={classes.toolbar}
                >
                    <Typography 
                        variant="h6"
                    >
                        Select Local User
                    </Typography>
                </Toolbar>
                <FormControl component="fieldset">
                    <RadioGroup 
                        aria-label="users" 
                        name="users" 
                        value={selectedUser}
                        onChange={handleUserChange}
                    >
                        {usersByName.map(user => (
                            <FormControlLabel
                                className={classes.label} 
                                key={user.id} 
                                value={user.id} 
                                control={<Radio color="primary" className={classes.radio}/>} 
                                label={user.name}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </div>
            <Toolbar>
                <DirectionButton
                    edge="start"
                    design="arrow" 
                    direction="left"
                    onClick={handleGoBack}
                />
                <FlexSpace />
                <Button
                    variant="outlined"
                    onClick={loadUser}
                    disabled={!selectedUser}
                >
                    Load
                </Button>
            </Toolbar>
        </>
    )
}

export default connector(AuthLocal);