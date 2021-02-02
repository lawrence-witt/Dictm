import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: 250,
        position: 'relative',
        borderTop: '1px solid red'
    },
    tape: {
        width: '100%',
        height: 225,
        position: 'absolute',
        bottom: 0,
        background: theme.palette.grey[200]
    }
}));

const WaveForm: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.tape}></div>
        </div>
    )
};

export default WaveForm;