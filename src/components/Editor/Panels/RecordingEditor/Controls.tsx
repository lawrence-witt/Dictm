import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { useCassetteStatus, useCassetteControls, useCassetteGetters } from '../../../../utils/providers/CassetteProvider';

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
        connect, insert,
        eject, addNode, removeNodes, 
        record, play, pause, scanBy
    } = useCassetteControls();
    const {
        context
    } = useCassetteGetters();
    const { status, flags } = useCassetteStatus();

    const isEditable = mode === 'edit';
    const isPlaying = status === "playing";
    const isRecording = status === "recording";

    const classes = useStyles({addPseudo: !isEditable || !flags.hasData});

    // Audio Node Refs
    const analyser = React.useRef(null) as React.MutableRefObject<AnalyserNode | null>;

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

    const handleRecord = React.useCallback(async () => {
        analyser.current = context().createAnalyser();
        await addNode(analyser.current, 0);
        await record();
    }, [addNode, record, context]);

    const handlePause = React.useCallback(async () => {
        await pause();

        if (isRecording) {
            if (analyser.current) await removeNodes([analyser.current]);
            analyser.current = null;
        }
    }, [removeNodes, pause, isRecording]);

    const handleSave = React.useCallback(async () => {
        const file = await eject();
        console.log(file);
    }, [eject]);

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
                <PauseButton color="inherit" onClick={() => handlePause()} disabled={!flags.canPause} /> :
                <PlayButton color="inherit" onClick={() => play()} disabled={!flags.canPlay}/>
            )}
            <PrimaryAudioButton 
                icon={primaryIcon}
                onClick={() => flags.canPause ? handlePause() : isEditable ? handleRecord() : play()}
                disabled={isEditable && isPlaying}
            />
            {flags.hasData && isEditable && <SaveButton color="inherit" onClick={handleSave} disabled={!flags.canEject}/>}
            {flags.hasData && <Forward5Button color="inherit" onClick={() => scanBy(5)} disabled={!flags.canScan}/>}
        </div>
    )
}

// Export

export default Controls;