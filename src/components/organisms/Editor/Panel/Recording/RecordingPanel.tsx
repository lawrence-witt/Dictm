import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { editorSelectors, editorOperations } from '../../../../../redux/ducks/editor';
import { recordingEditorOperations } from '../../../../../redux/ducks/editor/recording';

import FlexSpace from '../../../../atoms/FlexSpace/FlexSpace';

import { RecordingPanelProps, TimerHandle, WaveHandle } from './RecordingPanel.types';
import Timer from './Timer/Timer';
import WaveForm from './WaveForm/WaveForm';
import Form from './Form/Form';
import Controls from './Controls/Controls';

import { CassetteProgressCallback } from 'cassette-js';
import { demandAnimationFrame, cancelAnimationFrame } from 'demandanimationframe';

import useCassette from '../../../../../lib/hooks/useCassette';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    canSave: editorSelectors.getSaveAvailability(state.editor)
});

const mapDispatch = {
    updateData: recordingEditorOperations.updateRecordingEditorData,
    saveEditor: editorOperations.saveEditor
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const RecordingPanel: React.FC<RecordingPanelProps & ReduxProps> = (props) => {
    const {
        mode, 
        model,
        canSave,
        updateData,
        saveEditor
    } = props;

    /* 
    *   Animation refs
    */

    const nextFrame = React.useRef() as React.MutableRefObject<(() => void) | undefined>;
    const frameLoop = React.useRef() as React.MutableRefObject<ReturnType<typeof demandAnimationFrame>>;

    /* 
    *   Imperative handle refs
    */

    const timerHandle = React.useRef() as React.MutableRefObject<TimerHandle>;
    const waveHandle = React.useRef() as React.MutableRefObject<WaveHandle>;

    /* 
    *   Cassette callbacks
    */

    const onProgress = React.useCallback<CassetteProgressCallback>((progress, duration) => {
        nextFrame.current = () => {
            (handle => handle?.increment(progress, duration))(timerHandle.current);
            (handle => handle?.increment(progress, duration))(waveHandle.current);
            nextFrame.current = undefined;
        }
    }, []);

    /* 
    *   Cassette and audio refs
    */

    const cassette = useCassette(
        0.01,       // increment
        true,       // floorTimerOutput
        onProgress, // progress callback
        undefined,  // status callback
    );

    const stream = React.useRef(null) as React.MutableRefObject<MediaStream | null>;
    const analyser = React.useRef(null) as React.MutableRefObject<AnalyserNode | null>;

    /* 
    *   Handle user initiated controls with side effects
    */

    // Start recording or playing and begin animation loop

    const handleStart = React.useCallback(async (type: 'record' | 'play') => {
        if (type === 'record') {
            analyser.current = cassette.get.context().createAnalyser();
            analyser.current.fftSize = 1024;
            await cassette.controls.record([analyser.current]);
        } else {
            await cassette.controls.play();
        }

        const commitFrame = () => {
            if (nextFrame.current) nextFrame.current();
            frameLoop.current = demandAnimationFrame(commitFrame);
        }

        frameLoop.current = demandAnimationFrame(commitFrame);
    }, [cassette.get, cassette.controls]);

    // Stop recording or playing and persist new data to store

    const handleStop = React.useCallback(async () => {
        await cassette.controls.pause();
        cancelAnimationFrame(frameLoop.current);

        if (analyser.current) {
            analyser.current = null;

            const audioData = cassette.get.track()?.copy;
            const frequencyData = waveHandle.current.flush();

            if (!audioData) throw new Error('Could not retrieve audio data.');

            updateData({audio: audioData, frequencies: frequencyData});
        }
    }, [cassette.controls, cassette.get, updateData]);

    // Scan the available tape and force animation

    const handleScan = React.useCallback(async (type: 'to' | 'by', secs: number) => {
        if (type === "to") await cassette.controls.scanTo(secs);
        if (type === "by") await cassette.controls.scanBy(secs);

        if (nextFrame.current) demandAnimationFrame(nextFrame.current, true);
    }, [cassette.controls]);

    // Commit the recording model

    const handleSave = React.useCallback(async () => {
        saveEditor();
        handleScan("to", 0);
    }, [saveEditor, handleScan]);

    /* 
    *   Handle play resume after scan control
    */

    const resumeTimeout = React.useRef() as React.MutableRefObject<ReturnType<typeof setTimeout> | undefined>;

    React.useEffect(() => {
        if(!cassette.flags.canPlay && resumeTimeout.current) {
            clearTimeout(resumeTimeout.current);
            resumeTimeout.current = undefined;
        }
    }, [cassette.flags.canPlay]);

    const handleTimeout = React.useCallback((type: 'set' | 'clear') => {
        if (resumeTimeout.current) clearTimeout(resumeTimeout.current);

        if (type === "set") {
            resumeTimeout.current = setTimeout(() => {
                handleStart("play");
                resumeTimeout.current = undefined;
            }, 1000);
        } else {
            resumeTimeout.current = undefined;
        }
    }, [handleStart]);

    /* 
    *   Handle inserting audio and frequencies data
    */

    const insertFailed = React.useRef(false);

    const handleInsert = React.useCallback(async (
        audio: RecordingPanelProps["model"]["data"]["audio"]
    ) => {
        try {
            await cassette.controls.insert(audio);
        } catch(err) {
            console.log(err);
            // TODO: dispatch notification error
        }
    }, [cassette.controls]);

    React.useEffect(() => {
        if (mode !== "play" || !cassette.flags.canInsert || insertFailed.current) return;
        handleInsert(model.data.audio);
        waveHandle.current.init(model.data.frequencies);
        waveHandle.current.increment(0, model.data.audio.attributes.duration);
    }, [mode, model, cassette.flags, handleInsert]);

    /* 
    *   Handle getting and releasing microphone stream
    */

    const handleConnect = React.useCallback(async () => {
        if (cassette.flags.hasStream) return;

        try {
            const mic = await navigator.mediaDevices.getUserMedia({audio: true});
            stream.current = mic;
            await cassette.controls.connect(stream.current);
        } catch(err) {
            console.log(err);
            // TODO: dispatch notificaion error
        }
    }, [cassette.flags, cassette.controls]);

    React.useEffect(() => {
        if (mode !== "edit" || stream.current) return;
        handleConnect();
        if (!cassette.flags.hasData) waveHandle.current.init([]);
    }, [mode, cassette.flags, handleConnect]);

    React.useEffect(() => {
        return () => {
            if (stream.current) stream.current.getAudioTracks()[0].stop();
        }
    }, []);

    return (
        <>
            <Timer 
                timerHandle={timerHandle}
            />
            <WaveForm
                waveHandle={waveHandle}
                status={cassette.status}
                flags={cassette.flags}
                analyser={analyser.current}
                handleStop={handleStop}
                handleScan={handleScan}
                handleTimeout={handleTimeout}
            />
            <FlexSpace />
            {mode === "edit" && (
                <Form
                    title={model.attributes.title}
                    category={model.relationships.category?.id}
                    flags={cassette.flags}
                />
            )}
            <Controls 
                mode={mode} 
                status={cassette.status}
                flags={cassette.flags}
                canSave={canSave}
                handleStart={handleStart}
                handleStop={handleStop}
                handleScan={handleScan}
                handleSave={handleSave}
                handleTimeout={handleTimeout}
            />
        </>
    )
};

export default connector(RecordingPanel);