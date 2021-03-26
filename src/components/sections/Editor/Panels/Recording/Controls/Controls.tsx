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
        canSave,
        handleStart,
        handleStop,
        handleScan,
        handleSave,
        handleTimeout
    } = props;

    // Internal flags

    const isEditable = mode === 'edit';
    const isPlaying = status === "playing";
    const isRecording = status === "recording";

    // Styles

    const classes = useStyles({addPseudo: !isEditable || !flags.hasData});

    // Handle scanning with buttons

    const handleScanButton = React.useCallback(async (amnt: number) => {
        await handleScan("by", amnt);
        if (isPlaying) handleTimeout("set");
    }, [isPlaying, handleScan, handleTimeout]);

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
                    onClick={handleStop} 
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
                    disabled={!flags.canEject || !canSave}
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