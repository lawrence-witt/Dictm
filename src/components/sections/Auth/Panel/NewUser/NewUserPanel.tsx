import React from 'react';

import clsx from 'clsx';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import FlexSpace from '../../../../atoms/FlexSpace/FlexSpace';

const useStyles = makeStyles(theme => ({
    toolbar: {
        minHeight: 56
    },
    singleMargin: {
        marginBottom: theme.spacing(2)
    }
}))

const NewUserPanel: React.FC = () => {
    const classes = useStyles();

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
                fullWidth
                className={classes.singleMargin}
            />
            <TextField
                label="Greeting"
                fullWidth
            />
        </>
    )
}

export default NewUserPanel;