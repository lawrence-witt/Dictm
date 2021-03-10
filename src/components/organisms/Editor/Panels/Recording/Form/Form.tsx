import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { FormProps } from './Form.types';

import CustomSelect from '../../../../../atoms/Inputs/CustomSelect';

const useStyles = makeStyles(theme => ({
    form: {
        margin: `0px ${theme.spacing(3)}px`
    },
    textField: {
        marginBottom: theme.spacing(2)
    }
}));

const Form: React.FC<FormProps> = (props) => {
    const {
        flags
    } = props;

    const classes = useStyles();

    return flags.hasData ? (
        <form className={classes.form}>
            <TextField 
                label="Title" 
                fullWidth
                className={classes.textField}
            />
            <CustomSelect 
                label="Category"
                options={[]}
            />
        </form>
    ) : null;
};

export default Form;