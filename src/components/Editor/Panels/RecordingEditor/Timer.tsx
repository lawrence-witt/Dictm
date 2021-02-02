import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    timerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: `${theme.spacing(2)}px 0px`
    },
    typography: {
        fontWeight: 300
    }
}));

const Timer: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.timerContainer}>
            <Typography variant="h4" className={classes.typography}>
                <span>00</span>:<span>00</span>.<span>71</span>
            </Typography>
        </div>
    )
};

export default Timer;