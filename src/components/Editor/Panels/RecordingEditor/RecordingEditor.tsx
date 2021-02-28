import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MenuButton from '../../../Buttons/MenuButton';
import FlexSpace from '../../../Layout/FlexSpace';

import { RecordingBarButtonsProps, RecordingEditorProps, ProgressHandle } from './RecordingEditor.types';
import Timer from './Timer';
import WaveForm from './WaveForm';
import Form from './Form';
import Controls from './Controls';

import CassetteProvider from '../../../../utils/providers/CassetteProvider';
import { CassetteProgressCallback } from 'cassette-js';

/* RECORDING BAR BUTTONS */

const RecordingBarButtons: React.FC<RecordingBarButtonsProps> = (props) => {
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

    return mode === 'play' && playButtons;
};

/* RECORDING EDITOR */

const clockOptions = {
    increment: 0.01,
    floorOutput: true
}

const analyserOptions = {
    recording: true
}

const RecordingEditor: React.FC<RecordingEditorProps> = (props) => {
    const { mode = 'edit' } = props;

    const timerProgressHandle = React.useRef<ProgressHandle>();
    const waveProgressHandle = React.useRef<ProgressHandle>();

    const onProgress = React.useCallback<CassetteProgressCallback>((progress, duration) => {
        timerProgressHandle.current.increment(progress, duration);
        waveProgressHandle.current.increment(progress, duration);
    }, []);

    return (
        <CassetteProvider 
            clockOptions={clockOptions} 
            analyserOptions={analyserOptions}
            onProgress={onProgress}
        >
            <Timer progressHandle={timerProgressHandle}/>
            <WaveForm progressHandle={waveProgressHandle}/>
            <FlexSpace />
            {mode === "edit" && <Form />}
            <Controls mode={mode} />
        </CassetteProvider>
    )
};

/* EXPORTS */

export { RecordingBarButtons };
export default RecordingEditor;