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

/* TYPES */

interface ControlsProps {
    mode: 'play' | 'edit';
    hasData: boolean;
}

interface PlayControlsProps {
    isPlaying?: boolean;
    canRewind?: boolean;
    canForward?: boolean;
}

interface EditControlsProps {
    hasData?: boolean;
    isRecording?: boolean;
    isPlaying?: boolean;
    canRewind?: boolean;
    canForward?: boolean;
    canSave?: boolean;
}

/* PLAY CONTROLS */

const PlayControls: React.FC<PlayControlsProps> = (props) => {
    const {
        isPlaying,
        canRewind,
        canForward
    } = props;

    return (
        <>
            <Replay5Button color="inherit" disabled={!canRewind}/>
            <PrimaryAudioButton color="inherit" icon={isPlaying ? 'pause' : 'play'}/>
            <Forward5Button color="inherit" disabled={!canForward}/>
        </>
    );
};

/* EDIT CONTROLS */

const EditControls: React.FC<EditControlsProps> = (props) => {
    const {
        hasData,
        isPlaying,
        isRecording,
        canRewind = true,
        canForward = true,
        canSave
    } = props;

    const PrimaryControl = (
        <PrimaryAudioButton 
            icon={isRecording ? 'pause' : 'record'}
            disabled={isPlaying}
        />
    );

    return (
        <>
            {hasData && <Replay5Button color="inherit" disabled={!canRewind} />}
            {hasData && (
                isPlaying ? 
                <PauseButton color="inherit" /> : 
                <PlayButton color="inherit" disabled={isRecording}/>
            )}
            {PrimaryControl}
            {hasData && <SaveButton color="inherit" disabled={!canSave}/>}
            {hasData && <Forward5Button color="inherit" disabled={!canForward}/>}
        </>
    )
};

/* CONTROLS */

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

const Controls: React.FC<ControlsProps> = (props) => {
    const {
        mode,
        hasData
    } = props;

    const classes = useStyles({addPseudo: mode === 'play' || !hasData});

    const CurrentControls = mode === 'play' ? 
        <PlayControls /> : 
        <EditControls hasData={hasData}/>
    ;

    return (
        <div className={classes.controlsContainer}>
            {CurrentControls}
        </div>
    )
}

export default Controls;