import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { authOperations } from '../../../../../redux/ducks/auth';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    toolbar: {
        minHeight: 56
    },
    singleMargin: {
        marginBottom: theme.spacing(2)
    }
}))

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    name: state.auth.new.name,
    greeting: state.auth.new.greeting
});

const mapDispatch = {
    updateNewUser: authOperations.updateNewUser
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const NewUserPanel: React.FC<ReduxProps> = (props) => {
    const {
        name,
        greeting,
        updateNewUser
    } = props;

    const classes = useStyles();

    const handleFieldChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.name !== "name" && ev.target.name !== "greeting") return;
        updateNewUser(ev.target.name, ev.target.value);
    }, [updateNewUser]);

    return (
        <>
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
        </>
    )
}

export default connector(NewUserPanel);