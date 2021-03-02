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
        borderTop: '1px solid red',
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
        scrollbarWidth: 'none'
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

const WaveForm: React.FC<WaveFormProps> = (props) => {
    const {
        progressHandle
    } = props;

    // Cassette Props

    const { scanTo } = useCassetteControls();
    const { status } = useCassetteStatus();
    const { nodeMap } = useCassetteGetters();

    const isRecording = status === "recording";

    // Style

    const classes = useStyles();

    // Canvas Controls

    const canvasRef = React.useRef() as React.MutableRefObject<HTMLCanvasElement>;
    const waveClass = React.useRef() as React.MutableRefObject<WaveClass>;

    // Set Initial Options

    React.useLayoutEffect(() => {
        if (waveClass.current) return;

        waveClass.current = new WaveClass(canvasRef.current);
        waveClass.current.drawFrequencyData();
    }, []);

    // Handle Scroll Grab

    const tapeRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
    const scrollCoords = React.useRef<{left: number, x: number} | null>(null);

    const startScrollGrab = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        scrollCoords.current = {
            left: tapeRef.current.scrollLeft,
            x: e.clientX
        }
        e.currentTarget.style.cursor = "grabbing";
    }

    const handleScrollGrab = (e: React.MouseEvent) => {
        if (scrollCoords.current) {
            const dx = e.clientX - scrollCoords.current.x;
            tapeRef.current.scrollLeft = scrollCoords.current.left - dx;
        }
    }

    const stopScrollGrab = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        scrollCoords.current = null;
        e.currentTarget.style.cursor = "grab";
    }

    // Handle Cassette Tick

    const increment = React.useCallback<CassetteProgressCallback>((p: number, d: number) => {
        if (!isRecording) return;

        if (isRecording) {
            const analyser = nodeMap().recording[0];
            if (!(analyser instanceof AnalyserNode)) throw new Error('AnalyserNode not found.');
            waveClass.current.addFrequencyPoint(p, analyser);
        }
    }, [isRecording, nodeMap]);

    React.useImperativeHandle(progressHandle, () => ({
        increment
    }), [increment]);

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