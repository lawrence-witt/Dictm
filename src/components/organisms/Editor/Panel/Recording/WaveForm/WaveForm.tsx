import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { CassetteProgressCallback } from 'cassette-js';

import { WaveFormProps } from './WaveForm.types';
import WaveClass from './WaveForm.class';

// Styles

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: 250,
        position: 'relative',
        overflow: 'hidden'
    },
    background: {
        width: '100%',
        height: 225,
        position: 'absolute',
        bottom: 0,
        background: theme.palette.grey[200]
    },
    tape: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
        "-ms-overflow-style": 'none',
        "&::-webkit-scrollbar": {
            display: 'none'
        }
    },
    head: {
        height: 225,
        width: 2,
        position: 'absolute',
        bottom: 0,
        left: '50%',
        background: '#E43737'
    },
    scrollGrab: {
        height: 225,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        cursor: 'grab'
    },
    canvas: {
        height: 250,
        width: 0,
        margin: '0px calc(50% - 15px)'
    },
}));

const waveFormOptions = {
    font: '11px Roboto',
    secondBuffer: 10,
    secondWidth: 50,
    nullHeight: 2
}

const WaveForm: React.FC<WaveFormProps> = (props) => {
    const {
        waveHandle,
        status,
        flags,
        analyser,
        handleStop,
        handleScan,
        handleTimeout
    } = props;

    /* 
    *   Set up
    */

    // Cassette

    const isListening = status === "listening";
    const isRecording = status === "recording";
    const isPlaying = status === "playing";

    // Style

    const classes = useStyles();

    // Mutable State

    const canvasRef = React.useRef() as React.MutableRefObject<HTMLCanvasElement>;
    const waveClass = React.useRef() as React.MutableRefObject<WaveClass>;
    const freqArray = React.useRef(null) as React.MutableRefObject<Uint8Array | null>

    const tapeRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
    const scrollCoords = React.useRef<{left: number, x: number} | null>(null);

    const progressRef = React.useRef(0);
    const durationRef = React.useRef(0);

    const shouldResume = React.useRef(false);

    /* 
    *   Handle scanning with scroll grab
    */

    const startScrollGrab = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!flags.canScan) return;

        handleTimeout("clear");

        if (isPlaying) {
            handleStop();
            shouldResume.current = true;
        }

        scrollCoords.current = {
            left: tapeRef.current.scrollLeft,
            x: e.clientX
        }

        e.currentTarget.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
    }

    const moveScrollGrab = (e: React.MouseEvent) => {
        if (!scrollCoords.current) return;

        const dx = e.clientX - scrollCoords.current.x;
        const rawScroll = scrollCoords.current.left - dx;
        const maxScroll = durationRef.current * waveFormOptions.secondWidth;

        const clamped = Math.max(0, Math.min(rawScroll, maxScroll));
        const newProg = +((rawScroll/maxScroll) * durationRef.current).toFixed(2);

        handleScan("to", newProg);
        tapeRef.current.scrollLeft = clamped;
    }

    const stopScrollGrab = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!scrollCoords.current) return;

        if (shouldResume.current) {
            handleTimeout("set");
        }
        scrollCoords.current = null;

        e.currentTarget.style.cursor = "grab";
        document.body.style.removeProperty("user-select");
    }

    React.useEffect(() => {
        if (isPlaying) shouldResume.current = false;
    }, [isPlaying]);

    /* 
    *   Expose control methods to parent
    */

    const init = React.useCallback((frequencies: number[][]) => {
        waveClass.current = new WaveClass(canvasRef.current, waveFormOptions);
        waveClass.current.frequencyData = frequencies;
        waveClass.current.init();
    }, []);

    const increment = React.useCallback<CassetteProgressCallback>((p: number, d: number) => {
        progressRef.current = p;
        durationRef.current = d;

        if (scrollCoords.current) return;

        tapeRef.current.scrollLeft = p * waveFormOptions.secondWidth;

        if (isRecording) {
            if (!(analyser instanceof AnalyserNode)) throw new Error('AnalyserNode not found.');

            freqArray.current = freqArray.current || new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(freqArray.current);

            waveClass.current.buffer(p, freqArray.current);
        }
    }, [isRecording, analyser]);

    const flush = React.useCallback(() => {
        waveClass.current.flush(progressRef.current);
    }, []);

    const frequencies = React.useCallback(() => {
        return waveClass.current.frequencyData;
    }, []);

    React.useImperativeHandle(waveHandle, () => ({
        init,
        increment,
        flush,
        frequencies
    }), [init, increment, flush, frequencies]);

    React.useEffect(() => {
        if (isListening) waveClass.current.flush(progressRef.current);
    }, [isListening]);

    return (
        <div className={classes.container}>
            <div className={classes.background}></div>
            <div ref={tapeRef} className={classes.tape}>
                <canvas ref={canvasRef} className={classes.canvas}></canvas>
            </div>
            <div className={classes.head}></div>
            <div 
                className={classes.scrollGrab}
                onMouseDown={startScrollGrab}
                onMouseMove={moveScrollGrab}
                onMouseUp={stopScrollGrab}
                onMouseLeave={stopScrollGrab}
            ></div>
        </div>
    )
};

export default WaveForm;