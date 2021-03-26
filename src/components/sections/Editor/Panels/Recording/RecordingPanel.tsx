import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { connect, ConnectedProps } from 'react-redux';

import { editorOperations } from '../../../../../redux/ducks/editor';

import MenuButton from '../../../../atoms/Buttons/MenuButton';
import FlexSpace from '../../../../atoms/FlexSpace/FlexSpace';

import { RecordingBarButtonsProps, RecordingPanelProps, TimerHandle, WaveHandle } from './RecordingPanel.types';
import Timer from './Timer/Timer';
import WaveForm from './WaveForm/WaveForm';
import Form from './Form/Form';
import Controls from './Controls/Controls';

import { CassetteProgressCallback } from 'cassette-js';
import { demandAnimationFrame, cancelAnimationFrame } from 'demandanimationframe';

import useCassette from '../../../../../utils/hooks/useCassette';

/* RECORDING BAR BUTTONS */

const RecordingBarButtons: React.FC<RecordingBarButtonsProps> = (props) => {
    const {
        mode
    } = props;

    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    const closeMenu = React.useCallback(() => setMenuOpen(false), []);
    const toggleMenu = React.useCallback(() => setMenuOpen(s => !s), []);

    const playButtons = (
        <>
            <IconButton
                color="inherit"
            >
                <EditIcon />
            </IconButton>
            <MenuButton
                ref={menuRef}
                onClick={toggleMenu}
                color="inherit"
                design="dots"
                edge="end"
            />
            <Menu
                open={menuOpen}
                anchorEl={menuRef.current}
                onClose={closeMenu}
            >
                <MenuItem onClick={closeMenu}>Details</MenuItem>
                <MenuItem onClick={closeMenu}>Download</MenuItem>
            </Menu>
        </>
    );

    return mode === 'play' ? playButtons : null;
};

/* RECORDING EDITOR */

/* 
*   Redux
*/

const mapDispatch = {
    updateData: editorOperations.updateRecordingEditorData
}

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const RecordingPanel: React.FC<RecordingPanelProps & ReduxProps> = (props) => {
    const {
        mode, 
        model,
        updateData
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

    const handleScan = React.useCallback(async (type: 'to' | 'by', secs: number) => {
        if (type === "to") await cassette.controls.scanTo(secs);
        if (type === "by") await cassette.controls.scanBy(secs);

        if (nextFrame.current) demandAnimationFrame(nextFrame.current, true);
    }, [cassette.controls]);

    const handleSave = React.useCallback(async () => {
        const file = await cassette.controls.eject();
        console.log(file);
    }, [cassette.controls]);

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
                handleStart={handleStart}
                handleStop={handleStop}
                handleScan={handleScan}
                handleSave={handleSave}
                handleTimeout={handleTimeout}
            />
        </>
    )
};

/* EXPORTS */

export { RecordingBarButtons };
export default connector(RecordingPanel);