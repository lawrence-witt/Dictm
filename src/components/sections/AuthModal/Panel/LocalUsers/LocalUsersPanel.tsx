import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { makeStyles, Typography } from '@material-ui/core';

const userArray = [
    {id: "user1", name: "Lazarus"},
    {id: "user2", name: "Sarah"}
];

const useStyles = makeStyles(theme => ({
    toolbar: {
        minHeight: 56
    },
    control: {
        margin: 'unset'
    },
    label: {
        margin: 'unset',
        /* marginLeft: 15 */
    },
    radio: {
        paddingLeft: 'unset',
        marginRight: theme.spacing(1)
    }
}))

const LocalUsersPanel: React.FC = () => {
    const classes = useStyles();

    const [value, setValue] = React.useState("");

    const handleUserChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value);
    }, []);

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
                    value={value} 
                    onChange={handleUserChange}
                >
                    {userArray.map(user => (
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

export default LocalUsersPanel;