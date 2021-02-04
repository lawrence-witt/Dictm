import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import {
    PrimaryAudioButton,
    PlayButton,
    PauseButton,
    Replay5Button,
    Forward5Button,
    SaveButton
} from '../../../Buttons/AudioButtons';

// Types

interface ControlsProps {
    mode: 'play' | 'edit';
    hasData: boolean;
}

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
        hasData
    } = props;

    const isEditable = mode === 'edit';
    const classes = useStyles({addPseudo: !isEditable || !hasData});

    const isPlaying = false;
    const isRecording = false;
    const canRewind = false;
    const canSave = false;
    const canForward = false;

    const PrimaryControl = (
        <PrimaryAudioButton 
            icon={isEditable ? (
                isRecording ? 'pause' : 'record'
            ) : (
                isPlaying ? 'pause' : 'play'
            )}
            disabled={isEditable && isPlaying}
        />
    );

    return (
        <div className={classes.controlsContainer}>
            {hasData && <Replay5Button color="inherit" disabled={!canRewind} />}
            {hasData && isEditable && (
                isPlaying ? 
                <PauseButton color="inherit" /> :
                <PlayButton color="inherit" disabled={isRecording}/>
            )}
            {PrimaryControl}
            {hasData && isEditable && <SaveButton color="inherit" disabled={!canSave}/>}
            {hasData && <Forward5Button color="inherit" disabled={!canForward}/>}
        </div>
    )
}

// Export

export default Controls;