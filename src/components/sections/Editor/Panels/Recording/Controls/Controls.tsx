import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { ControlsProps } from './Controls.types';

import {
    PrimaryAudioButton,
    PlayButton,
    PauseButton,
    Replay5Button,
    Forward5Button,
    SaveButton
} from '../../../../../atoms/Buttons/AudioButtons';

// Styled

const useStyles = makeStyles<Theme, {addPseudo: boolean}>(theme => 
    createStyles({
        controlsContainer: {
            width: '100%',
            margin: `
                ${theme.spacing(6)}px 
                0px
                ${theme.spacing(3)}px`,
            padding: `0px ${theme.spacing(1)}px`,
            display: 'flex',
            justifyContent: 'space-between',

            "&::before, &::after": {
                content: '""',
                width: 48,
                display: ({addPseudo}) => addPseudo ? 'block' : 'none'
            }
        }
    })
);

// Component

const Controls: React.FC<ControlsProps> = (props) => {
    const { 
        mode,
        status,
        flags,
        controls,
        handleStart,
        handleStop,
        handleScan,
        handleTimeout
    } = props;

    // Cassette

    const { 
        connect, eject
    } = controls;

    const isEditable = mode === 'edit';
    const isPlaying = status === "playing";
    const isRecording = status === "recording";

    // Styles

    const classes = useStyles({addPseudo: !isEditable || !flags.hasData});

    // Handle connect and save

    const streamRef = React.useRef(null) as React.MutableRefObject<MediaStream | null>;

    const handleConnect = React.useCallback(async () => {
        if (flags.hasStream) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            streamRef.current = stream;
            await connect(stream);
        } catch(err) {
            console.log(err);
            // send to toast
        }
    }, [flags.hasStream, connect]);

    const handleSave = React.useCallback(async () => {
        const file = await eject();
        console.log(file);
    }, [eject]);

    // Handle scanning with buttons

    const handleScanButton = React.useCallback(async (amnt: number) => {
        await handleScan("by", amnt);
        if (isPlaying) handleTimeout("set");
    }, [isPlaying, handleScan, handleTimeout]);

    // Handle getting and releasing microphone stream

    React.useEffect(() => {
        if (mode !== "edit" || streamRef.current) return;
        handleConnect();
    }, [mode, handleConnect]);

    React.useEffect(() => {
        return () => {
            if (streamRef.current) streamRef.current.getAudioTracks()[0].stop();
        }
    }, []);

    // Deduce primary icon type

    const primaryIcon = (
        isEditable ? (
            isRecording ? 'pause' : 'record'
        ) : (
            isPlaying ? 'pause' : 'play'
        )
    )

    return (
        <div className={classes.controlsContainer}>
            {flags.hasData && 
                <Replay5Button 
                    color="inherit" 
                    onClick={() => handleScanButton(-5)} 
                    disabled={!flags.canScan} 
                />}
            {flags.hasData && isEditable && (
                isPlaying ? 
                <PauseButton 
                    color="inherit" 
                    onClick={() => handleStop()} 
                    disabled={!flags.canPause} 
                /> :
                <PlayButton 
                    color="inherit" 
                    onClick={() => handleStart('play')} 
                    disabled={!flags.canPlay}
                />
            )}
            <PrimaryAudioButton 
                icon={primaryIcon}
                onClick={() => flags.canPause ? handleStop() : handleStart(isEditable ? 'record' : 'play')}
                disabled={isEditable && isPlaying}
            />
            {flags.hasData && isEditable && 
                <SaveButton 
                    color="inherit" 
                    onClick={handleSave} 
                    disabled={!flags.canEject}
                    />}
            {flags.hasData && 
                <Forward5Button 
                    color="inherit" 
                    onClick={() => handleScanButton(5)} 
                    disabled={!flags.canScan}
                />}
        </div>
    )
}

// Export

export default Controls;