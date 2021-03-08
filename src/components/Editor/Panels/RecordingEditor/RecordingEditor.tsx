import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MenuButton from '../../../Buttons/MenuButton';
import FlexSpace from '../../../Layout/FlexSpace';

import { RecordingEditorProps, ProgressHandle } from './RecordingEditor.types';
import Timer from './Timer/Timer';
import WaveForm from './WaveForm/WaveForm';
import Form from './Form/Form';
import Controls from './Controls/Controls';

import { CassetteProgressCallback } from 'cassette-js';
import { demandAnimationFrame, cancelAnimationFrame } from 'demandanimationframe';

import useCassette from '../../../../utils/hooks/useCassette';

/* RECORDING BAR BUTTONS */

const RecordingBarButtons: React.FC<RecordingEditorProps> = (props) => {
    const {
        mode = 'edit'
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

const RecordingEditor: React.FC<RecordingEditorProps> = (props) => {
    const { mode = 'edit' } = props;

    /* 
    *   Animation refs
    */

    const nextFrame = React.useRef() as React.MutableRefObject<(() => void) | undefined>;
    const frameLoop = React.useRef() as React.MutableRefObject<ReturnType<typeof demandAnimationFrame>>;

    const timerProgressHandle = React.useRef() as React.MutableRefObject<ProgressHandle>;
    const waveProgressHandle = React.useRef() as React.MutableRefObject<ProgressHandle>;

    /* 
    *   Cassette handlers
    */

    const onProgress = React.useCallback<CassetteProgressCallback>((progress, duration) => {
        nextFrame.current = () => {
            timerProgressHandle.current.increment(progress, duration);
            waveProgressHandle.current.increment(progress, duration);
            nextFrame.current = undefined;
        }
    }, []);

    const onError = React.useCallback((error) => console.error(error), []);

    /* 
    *   Cassette and analyser
    */

    const cassette = useCassette(
        0.01,       // increment
        true,       // floorOutput
        onProgress, // progress callback
        undefined,  // status callback
        onError     // error callback
    );

    const analyser = React.useRef(null) as React.MutableRefObject<AnalyserNode | null>;

    /* 
    *   Handle controls with side effects
    */

    const handleFrame = React.useCallback(() => {
        if (nextFrame.current) nextFrame.current();
        frameLoop.current = demandAnimationFrame(handleFrame);
    }, []);

    const handleStart = React.useCallback(async (type: 'record' | 'play') => {
        if (type === 'record') {
            analyser.current = cassette.get.context().createAnalyser();
            analyser.current.fftSize = 1024;
            await cassette.controls.addNode(analyser.current, 0);
            await cassette.controls.record();
        } else {
            await cassette.controls.play();
        }

        frameLoop.current = demandAnimationFrame(handleFrame);
    }, [cassette.get, cassette.controls, handleFrame]);

    const handleStop = React.useCallback(async () => {
        await cassette.controls.pause();
        cancelAnimationFrame(frameLoop.current);

        if (analyser.current) {
            await cassette.controls.removeNodes([analyser.current]);
            analyser.current = null;
        }
    }, [cassette.controls]);

    const handleScan = React.useCallback(async (type: 'to' | 'by', secs: number) => {
        if (type === "to") await cassette.controls.scanTo(secs);
        if (type === "by") await cassette.controls.scanBy(secs);

        if (nextFrame.current) demandAnimationFrame(nextFrame.current, true);
    }, [cassette.controls]);

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
                progressHandle={timerProgressHandle}
            />
            <WaveForm
                progressHandle={waveProgressHandle}
                status={cassette.status}
                flags={cassette.flags}
                nodeMap={cassette.get.nodeMap}
                handleStop={handleStop}
                handleScan={handleScan}
                handleTimeout={handleTimeout}
            />
            <FlexSpace />
            {mode === "edit" && 
                <Form 
                    flags={cassette.flags}
                />}
            <Controls 
                mode={mode} 
                status={cassette.status}
                flags={cassette.flags}
                controls={cassette.controls}
                handleStart={handleStart}
                handleStop={handleStop}
                handleScan={handleScan}
                handleTimeout={handleTimeout}
            />
        </>
    )
};

/* EXPORTS */

export { RecordingBarButtons };
export default RecordingEditor;