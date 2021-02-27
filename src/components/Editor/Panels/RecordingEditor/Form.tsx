import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { useCassetteStatus } from '../../../../utils/providers/CassetteProvider';

import CustomSelect from '../../../Inputs/CustomSelect';

const useStyles = makeStyles(theme => ({
    form: {
        margin: `0px ${theme.spacing(3)}px`
    },
    textField: {
        marginBottom: theme.spacing(2)
    }
}));

const Form: React.FC = () => {
    const classes = useStyles();

    const { flags } = useCassetteStatus();

    return flags.hasData && (
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
    );
};

export default Form;