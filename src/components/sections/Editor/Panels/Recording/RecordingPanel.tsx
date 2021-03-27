import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';
import { editorOperations, editorSelectors } from '../../../../../redux/ducks/editor';

import FlexSpace from '../../../../atoms/FlexSpace/FlexSpace';

import { RecordingPanelProps, TimerHandle, WaveHandle } from './RecordingPanel.types';
import Timer from './Timer/Timer';
import WaveForm from './WaveForm/WaveForm';
import Form from './Form/Form';
import Controls from './Controls/Controls';

import { CassetteProgressCallback } from 'cassette-js';
import { demandAnimationFrame, cancelAnimationFrame } from 'demandanimationframe';

import useCassette from '../../../../../utils/hooks/useCassette';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    canSave: editorSelectors.getSaveAvailability(state)
});

const mapDispatch = {
    updateData: editorOperations.updateRecordingEditorData,
    saveRecording: editorOperations.saveRecordingEditorModel
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
        saveRecording
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
            timerHandle.current.increment(progress, duration);
            waveHandle.current.increment(progress, duration);
            nextFrame.current = undefined;
        }
    }, []);

    const onError = React.useCallback((error) => console.error(error), []);

    /* 
    *   Cassette and audio refs
    */

    const cassette = useCassette(
        0.01,       // increment
        true,       // floorTimerOutput
        onProgress, // progress callback
        undefined,  // status callback
        onError     // error callback
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
            await cassette.controls.addNode(analyser.current, 0);
            await cassette.controls.record();
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
            await cassette.controls.removeNodes([analyser.current]);
            analyser.current = null;

            const audioData = cassette.get.wavData();
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
        saveRecording();
        handleScan("to", 0);
    }, [saveRecording, handleScan]);

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
        if (mode === "play" || stream.current) return;
        handleConnect();
    }, [mode, handleConnect]);

    React.useEffect(() => {
        return () => {
            if (stream.current) stream.current.getAudioTracks()[0].stop();
        }
    }, []);

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

    return (
        <>
            <Timer 
                timerHandle={timerHandle}
            />
            <WaveForm
                waveHandle={waveHandle}
                status={cassette.status}
                flags={cassette.flags}
                nodeMap={cassette.get.nodeMap}
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