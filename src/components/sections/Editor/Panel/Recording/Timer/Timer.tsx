import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { formatDuration } from '../../../../../../lib/utils/FormatTime';

import { TimerProps } from './Timer.types';

// Styles

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

// Component

const Timer: React.FC<TimerProps> = (props) => {
    const {
        timerHandle
    } = props;

    const classes = useStyles();

    const minRef = React.useRef() as React.MutableRefObject<HTMLSpanElement>;
    const secRef = React.useRef() as React.MutableRefObject<HTMLSpanElement>;
    const csRef = React.useRef() as React.MutableRefObject<HTMLSpanElement>;

    const increment = React.useCallback((progress: number) => {
        const { m, s, cs } = formatDuration(progress);

        minRef.current.innerHTML = m;
        secRef.current.innerHTML = s;
        csRef.current.innerHTML = cs;
    }, []);

    React.useImperativeHandle(timerHandle, () => ({
        increment
    }), [increment]);

    return (
        <div className={classes.timerContainer}>
            <Typography variant="h4" className={classes.typography}>
                <span ref={minRef}>00</span>:<span ref={secRef}>00</span>.<span ref={csRef}>00</span>
            </Typography>
        </div>
    )
};

export default Timer;