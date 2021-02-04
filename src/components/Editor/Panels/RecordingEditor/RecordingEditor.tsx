import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MenuButton from '../../../Buttons/MenuButton';
import FlexSpace from '../../../Layout/FlexSpace';

import Timer from './Timer';
import WaveForm from './WaveForm';
import Form from './Form';
import Controls from './Controls';

import CassetteProvider from '../../../../utils/providers/CassetteProvider';

/* TYPES */

interface RecordingBarButtonsProps {
    mode: 'edit' | 'play';
}

interface RecordingEditorProps {
    hasData: boolean;
    mode: 'edit' | 'play';
}

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

const RecordingEditor: React.FC<RecordingEditorProps> = (props) => {
    const {
        hasData = true,
        mode = 'edit'
    } = props;

    return (
        <CassetteProvider>
            <Timer />
            <WaveForm />
            <FlexSpace />
            {hasData && mode === "edit" && <Form />}
            <Controls hasData={hasData} mode={mode}/>
        </CassetteProvider>
    )
};

/* EXPORTS */

export { RecordingBarButtons };
export default RecordingEditor;