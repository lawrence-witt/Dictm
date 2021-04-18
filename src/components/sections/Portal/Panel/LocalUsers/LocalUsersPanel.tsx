import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { authOperations, authSelectors } from '../../../../../redux/ducks/auth';

import Toolbar from '@material-ui/core/Toolbar';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { makeStyles, Typography } from '@material-ui/core';

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
    selectLocalUser: authOperations.selectLocalUser
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(theme => ({
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

const LocalUsersPanel: React.FC<ReduxProps> = (props) => {
    const {
        selectedUser,
        usersByName,
        selectLocalUser
    } = props;

    const classes = useStyles();

    const handleUserChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        selectLocalUser(ev.target.value);
    }, [selectLocalUser]);

    return (
        <>
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
        </>
    )
}

export default connector(LocalUsersPanel);