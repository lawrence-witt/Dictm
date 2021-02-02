import React from 'react';

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
            <Replay5Button disabled={!canRewind}/>
            <PrimaryAudioButton icon={isPlaying ? 'pause' : 'play'}/>
            <Forward5Button disabled={!canForward}/>
        </>
    );
};

/* EDIT CONTROLS */

const EditControls: React.FC<EditControlsProps> = (props) => {
    const {
        hasData,
        isPlaying,
        isRecording,
        canRewind,
        canForward,
        canSave
    } = props;

    const PrimaryControl = (
        <PrimaryAudioButton 
            icon={isRecording ? 'pause' : 'record'}
            disabled={isPlaying}
        />
    )

    const FullControls = React.useCallback((props: {children: React.ReactNode}) => (
        <>
            <Replay5Button disabled={!canRewind}/>
            {isPlaying ? <PauseButton /> : <PlayButton disabled={isRecording}/>}
            {props.children}
            <SaveButton disabled={!canSave}/>
            <Forward5Button disabled={!canForward}/>
        </>
    ), [isPlaying, isRecording, canRewind, canForward, canSave]);

    return hasData ? <FullControls>{PrimaryControl}</FullControls> : PrimaryControl;
};

/* CONTROLS */

const Controls: React.FC<ControlsProps> = (props) => {
    const {
        mode,
        hasData
    } = props;

    const CurrentControls = mode === 'play' ? 
        <PlayControls /> : 
        <EditControls hasData={hasData}/>
    ;

    return (
        <div>
            {CurrentControls}
        </div>
    )
}

export default Controls;