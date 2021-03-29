import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MenuButton from '../../../../atoms/Buttons/MenuButton';

import { recordingEditorOperations } from '../../../../../redux/ducks/editor/recording';

import { RecordingPanelButtonsProps } from './RecordingPanel.types';

/* 
*   Redux
*/

const mapDispatch = {
    updateMode: recordingEditorOperations.updateRecordingEditorMode
}

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const RecordingPanelButtons: React.FC<RecordingPanelButtonsProps & ReduxProps> = (props) => {
    const {
        mode,
        updateMode
    } = props;

    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    const setEditMode = React.useCallback(() => updateMode("edit"), [updateMode]);

    const closeMenu = React.useCallback(() => setMenuOpen(false), []);
    const toggleMenu = React.useCallback(() => setMenuOpen(s => !s), []);

    const playButtons = (
        <>
            <IconButton
                color="inherit"
                onClick={setEditMode}
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

export default connector(RecordingPanelButtons);