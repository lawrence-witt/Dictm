import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { ProgressHandle } from './RecordingEditor.types';

interface TimerProps {
    progressHandle: React.RefObject<ProgressHandle>;
}

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

const Timer: React.FC<TimerProps> = ({ progressHandle }) => {
    const classes = useStyles();

    const minRef = React.useRef<HTMLSpanElement>();
    const secRef = React.useRef<HTMLSpanElement>();
    const csRef = React.useRef<HTMLSpanElement>();

    const increment = React.useCallback((progress: number) => {
        const totalMs = progress * 1000;
        const d = new Date(totalMs);

        const addZero = (n: number) => n < 10 ? `0${n}`: `${n}`;

        minRef.current.innerHTML = addZero(d.getMinutes());
        secRef.current.innerHTML = addZero(d.getSeconds());
        csRef.current.innerHTML = addZero(Math.floor(d.getMilliseconds() / 10));
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