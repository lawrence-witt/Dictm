import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MenuButton from '../../../Buttons/MenuButton';
import FlexSpace from '../../../Layout/FlexSpace';

import Timer from './Timer';
import WaveForm from './WaveForm';
import Controls from './Controls';

/* RECORDING BAR BUTTONS */

const RecordingBarButtons: React.FC = () => {
    const mode = 'play';

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

    return mode == 'play' && playButtons;
};

/* RECORDING EDITOR */

const RecordingEditor: React.FC = () => {
    return (
        <>
            <Timer />
            <WaveForm />
            <FlexSpace />
            <Controls hasData={false} mode="play"/>
        </>
    )
};

/* EXPORTS */

export { RecordingBarButtons };
export default RecordingEditor;