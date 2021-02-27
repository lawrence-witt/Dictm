import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { useCassetteStatus, useCassetteControls } from '../../../../utils/providers/CassetteProvider';

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
    const { mode } = props;

    // Flags and Props

    const { 
        connect, disconnect, insert, 
        eject, record, play, 
        pause, scanTo, scanBy, unlink 
    } = useCassetteControls();
    const { status, flags } = useCassetteStatus();

    const isEditable = mode === 'edit';
    const isPlaying = status === "playing";
    const isRecording = status === "recording";

    const classes = useStyles({addPseudo: !isEditable || !flags.hasData});

    // Handlers

    const handleConnect = React.useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            await connect(stream);
        } catch(err) {
            console.log(err);
            // send to toast
        }
    }, [connect]);
    
    const handleSave = async () => {
        const file = await eject();
        console.log(file);
    }

    // Get Stream in Edit Mode

    React.useEffect(() => {
        if (mode !== "edit") return;
        handleConnect();
    }, [mode, handleConnect]);

    // Deduce primary icon type

    const primaryIcon = (
        isEditable ? (
            isRecording ? 'pause' : 'record'
        ) : (
            isPlaying ? 'play' : 'pause'
        )
    )

    return (
        <div className={classes.controlsContainer}>
            {flags.hasData && <Replay5Button color="inherit" onClick={() => scanBy(-5)} disabled={!flags.canScan} />}
            {flags.hasData && isEditable && (
                isPlaying ? 
                <PauseButton color="inherit" onClick={pause} disabled={!flags.canPause} /> :
                <PlayButton color="inherit" onClick={play} disabled={!flags.canPlay}/>
            )}
            <PrimaryAudioButton 
                icon={primaryIcon}
                onClick={flags.canPause ? pause : isEditable ? record : play}
                disabled={isEditable && isPlaying}
            />
            {flags.hasData && isEditable && <SaveButton color="inherit" onClick={handleSave} disabled={!flags.canEject}/>}
            {flags.hasData && <Forward5Button color="inherit" onClick={() => scanBy(5)} disabled={!flags.canScan}/>}
        </div>
    )
}

// Export

export default Controls;