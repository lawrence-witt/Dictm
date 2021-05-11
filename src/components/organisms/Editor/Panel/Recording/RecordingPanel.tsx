import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { CassetteProgressCallback } from 'cassette-js';

import { RootState } from '../../../../../redux/store';
import { editorSelectors, editorOperations } from '../../../../../redux/ducks/editor';
import { recordingEditorOperations } from '../../../../../redux/ducks/editor/recording';
import { notificationsOperations } from '../../../../../redux/ducks/notifications';

import FlexSpace from '../../../../atoms/FlexSpace/FlexSpace';

import { RecordingPanelProps, TimerHandle, WaveHandle } from './RecordingPanel.types';
import Timer from './Timer/Timer';
import WaveForm from './WaveForm/WaveForm';
import Form from './Form/Form';
import Controls from './Controls/Controls';

import useCassette from '../../../../../lib/hooks/useCassette';
import useThrottledFunction from '../../../../../lib/hooks/useThrottledFunction';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    saveAvailability: editorSelectors.getSaveAvailability(state.content, state.editor)
});

const mapDispatch = {
    updateAttributes: recordingEditorOperations.updateRecordingEditorAttributes,
    updateData: recordingEditorOperations.updateRecordingEditorData,
    updateSaving: recordingEditorOperations.updateRecordingEditorSaving,
    saveEditor: editorOperations.saveEditor,
    notifyError: notificationsOperations.notifyRecordingError
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const RecordingPanel: React.FC<RecordingPanelProps & ReduxProps> = (props) => {
    const {
        mode,
        isSaveRequested,
        model,
        saveAvailability,
        updateAttributes,
        updateData,
        updateSaving,
        saveEditor,
        notifyError
    } = props;

    /* 
    *   Animation refs
    */

    const nextFrame = React.useRef() as React.MutableRefObject<(() => void) | undefined>;
    const frameLoop = React.useRef() as React.MutableRefObject<ReturnType<typeof requestAnimationFrame>>;

    /* 
    *   Imperative handle refs
    */

    const timerHandle = React.useRef() as React.MutableRefObject<TimerHandle>;
    const waveHandle = React.useRef() as React.MutableRefObject<WaveHandle>;

    /* 
    *   Cassette callbacks
    */

    const bufferWaveForm = useThrottledFunction((p: number, d: number) => {
        waveHandle.current?.buffer(p, d);
    }, 35);

    const onProgress = React.useCallback<CassetteProgressCallback>((progress, duration) => {
        bufferWaveForm(progress, duration);

        nextFrame.current = () => {
            timerHandle.current?.draw(progress, duration);
            waveHandle.current?.draw(progress, duration);
            nextFrame.current = undefined;
        }
    }, [bufferWaveForm]);

    /* 
    *   Cassette and audio refs
    */

    const cassette = useCassette(
        0.01,       // increment
        true,       // floorTimerOutput
        onProgress, // progress callback
        undefined,  // status callback
    );

    const stream = React.useRef<MediaStream | null>(null);
    const analyser = React.useRef<AnalyserNode | null>(null);

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
            frameLoop.current = requestAnimationFrame(commitFrame);
        }

        frameLoop.current = requestAnimationFrame(commitFrame);
    }, [cassette.get, cassette.controls]);

    // Stop recording or playing and persist new data to store

    const handleStop = React.useCallback(async () => {
        await cassette.controls.pause();
        cancelAnimationFrame(frameLoop.current);

        if (analyser.current) {
            analyser.current = null;

            const audioAttributes = cassette.get.track()?.attributes;
            waveHandle.current.flush();

            if (!audioAttributes) return;

            updateAttributes(audioAttributes);
        }
    }, [cassette.controls, cassette.get, updateAttributes]);

    // Scan the available tape and force animation

    const handleScan = React.useCallback(async (type: 'to' | 'by', secs: number) => {
        if (type === "to") await cassette.controls.scanTo(secs);
        if (type === "by") await cassette.controls.scanBy(secs);

        if (nextFrame.current) requestAnimationFrame(nextFrame.current);
    }, [cassette.controls]);

    // Commit the Recording model

    /* useCallback cannot automatically infer from literal type for some reason */
    /* eslint-disable-next-line */
    const handleSave = React.useCallback(async (reset: boolean = true) => {
        const audio = cassette.get.track()?.copy;
        const frequencies = waveHandle.current.frequencies();

        if (!audio) return;
        
        updateData({ audio, frequencies });
        saveEditor();
        if (reset) handleScan("to", 0);
    }, [cassette.get, updateData, saveEditor, handleScan]);

    React.useEffect(() => {
        if (!isSaveRequested) return;
        updateSaving(false);
        handleSave(false);
    }, [updateSaving, isSaveRequested, handleSave]);

    /* 
    *   Handle play resume after scan control
    */

    const resumeTimeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

    // This flag is currently necessary to prevent an infinite loop on error, 
    // since insert triggers two flag updates
    const insertFailed = React.useRef(false);

    const handleInsert = React.useCallback(async (
        audio: RecordingPanelProps["model"]["data"]["audio"]
    ) => {
        try {
            await cassette.controls.insert(audio);
        } catch(err) {
            notifyError("insert", err.message);
            insertFailed.current = true;
        }
    }, [cassette.controls, notifyError]);

    React.useEffect(() => {
        if (mode !== "play" || !cassette.flags.canInsert || insertFailed.current) return;
        handleInsert(model.data.audio);
        waveHandle.current.init(model.data.frequencies);
        waveHandle.current.draw(0, model.data.audio.attributes.duration);
    }, [mode, model.data, cassette.flags, handleInsert]);

    /* 
    *   Handle getting and releasing microphone stream
    */

    const handleConnect = React.useCallback(() => {
        let attemptValid = true;

        (async () => {
            try {
                const mic = await navigator.mediaDevices.getUserMedia({audio: true});
    
                if (!attemptValid) return;
    
                stream.current = mic;
                await cassette.controls.connect(stream.current);
            } catch(err) {
                notifyError("connect", err.message);
            }
        })();

        return {
            cancel: () => { attemptValid = false; }
        }
    }, [cassette.controls, notifyError]);

    React.useEffect(() => {
        if (mode !== "edit" || !cassette.flags.canConnect) return;
        const attempt = handleConnect();
        if (!cassette.flags.hasData) waveHandle.current.init([]);

        return () => attempt.cancel();
    }, [mode, cassette.flags, handleConnect]);

    React.useEffect(() => {
        return () => { stream.current && stream.current.getAudioTracks()[0].stop(); };
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
                canSave={saveAvailability.hasRequiredProperties}
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