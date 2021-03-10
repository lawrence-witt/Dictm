import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

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

const Timer: React.FC<TimerProps> = ({ progressHandle }) => {
    const classes = useStyles();

    const minRef = React.useRef<HTMLSpanElement>(null);
    const secRef = React.useRef<HTMLSpanElement>(null);
    const csRef = React.useRef<HTMLSpanElement>(null);

    const increment = React.useCallback((progress: number) => {
        const totalMs = progress * 1000;
        const d = new Date(totalMs);

        const addZero = (n: number) => n < 10 ? `0${n}`: `${n}`;

        if (minRef.current) minRef.current.innerHTML = addZero(d.getMinutes());
        if (secRef.current) secRef.current.innerHTML = addZero(d.getSeconds());
        if (csRef.current) csRef.current.innerHTML = addZero(Math.floor(d.getMilliseconds() / 10));
    }, []);

    React.useImperativeHandle(progressHandle, () => ({
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