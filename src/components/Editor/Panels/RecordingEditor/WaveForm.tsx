import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { CassetteProgressCallback } from 'cassette-js';
import { ProgressHandle } from './RecordingEditor.types';
import WaveClass from './WaveForm.class';

import { useCassetteControls, useCassetteStatus, useCassetteGetters } from '../../../../utils/providers/CassetteProvider';

interface WaveFormProps {
    progressHandle: React.RefObject<ProgressHandle>;
}

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
        width: 1,
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
    secondWidth: 50
}

const WaveForm: React.FC<WaveFormProps> = (props) => {
    const {
        progressHandle
    } = props;

    // Cassette Props

    const { pause, play, scanTo } = useCassetteControls();
    const { status, flags } = useCassetteStatus();
    const { nodeMap } = useCassetteGetters();

    const isListening = status === "listening";
    const isRecording = status === "recording";

    // Style

    const classes = useStyles();

    // Mutable State

    const canvasRef = React.useRef() as React.MutableRefObject<HTMLCanvasElement>;
    const waveClass = React.useRef() as React.MutableRefObject<WaveClass>;

    const tapeRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
    const scrollCoords = React.useRef<{left: number, x: number} | null>(null);

    const progressRef = React.useRef(0);
    const durationRef = React.useRef(0);

    const shouldResume = React.useRef(false);
    const resumeTimeout = React.useRef(null) as React.MutableRefObject<ReturnType<typeof setTimeout> | null>;

    // Set Initial Options

    React.useLayoutEffect(() => {
        if (waveClass.current) return;

        waveClass.current = new WaveClass(canvasRef.current, waveFormOptions);
        waveClass.current.drawFrequencyData();
    }, []);

    // Cancel Timeout

    React.useEffect(() => {
        if(!flags.canPlay && resumeTimeout.current) {
            clearTimeout(resumeTimeout.current);
            resumeTimeout.current = null;
        }
    }, [flags.canPlay]);

    // Handle Scroll Grab

    const startScrollGrab = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!flags.canScan) return;

        if (resumeTimeout.current) { 
            clearTimeout(resumeTimeout.current);
            resumeTimeout.current = null;
        }
        if (flags.canPause) {
            pause();
            shouldResume.current = true;
        }

        scrollCoords.current = {
            left: tapeRef.current.scrollLeft,
            x: e.clientX
        }

        e.currentTarget.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
    }

    const handleScrollGrab = async (e: React.MouseEvent) => {
        if (!scrollCoords.current) return;

        const dx = e.clientX - scrollCoords.current.x;
        const rawScroll = scrollCoords.current.left - dx;
        const maxScroll = durationRef.current * waveFormOptions.secondWidth;

        const clamped = Math.max(0, Math.min(rawScroll, maxScroll));
        const newProg = +((rawScroll/maxScroll) * durationRef.current).toFixed(2);

        await scanTo(newProg);
        tapeRef.current.scrollLeft = clamped;
    }

    const stopScrollGrab = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!scrollCoords.current) return;

        if (shouldResume.current) {
            resumeTimeout.current = setTimeout(() => {
                play();
                shouldResume.current = false;
            }, 1000);
        }
        scrollCoords.current = null;

        e.currentTarget.style.cursor = "grab";
        document.body.style.removeProperty("user-select");
    }

    // Handle Cassette Tick

    const increment = React.useCallback<CassetteProgressCallback>((p: number, d: number) => {
        progressRef.current = p;
        durationRef.current = d;

        if (scrollCoords.current) return;

        tapeRef.current.scrollLeft = p * waveFormOptions.secondWidth;

        if (isRecording) {
            const analyser = nodeMap().recording[0];
            if (!(analyser instanceof AnalyserNode)) throw new Error('AnalyserNode not found.');
            waveClass.current.addFrequencyPoint(p, analyser);
        }
    }, [isRecording, nodeMap]);

    React.useImperativeHandle(progressHandle, () => ({
        increment
    }), [increment]);

    React.useEffect(() => {
        const shouldFlush = Math.round(progressRef.current * 10) > progressRef.current * 10
        if (isListening && shouldFlush) waveClass.current.flushFrequencyBuffer();
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
                onMouseMove={handleScrollGrab}
                onMouseUp={stopScrollGrab}
                onMouseLeave={stopScrollGrab}
            ></div>
        </div>
    )
};

export default WaveForm;