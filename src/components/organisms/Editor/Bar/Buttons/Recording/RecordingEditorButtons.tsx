import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import MenuItem from '@material-ui/core/MenuItem';

import DropdownMenu from '../../../../../molecules/DropdownMenu/DropdownMenu';

import { editorOperations } from '../../../../../../redux/ducks/editor';
import { recordingEditorOperations } from '../../../../../../redux/ducks/editor/recording';

import { RecordingEditorButtonsProps } from './RecordingEditorButtons.types';

/* 
*   Redux
*/

const mapDispatch = {
    updateMode: recordingEditorOperations.updateRecordingEditorMode,
    openDetailsDialog: editorOperations.openDetailsDialog
}

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const RecordingPanelButtons: React.FC<RecordingEditorButtonsProps & ReduxProps> = (props) => {
    const {
        mode,
        model,
        updateMode,
        openDetailsDialog
    } = props;

    const onSelectEdit = React.useCallback(() => updateMode("edit"), [updateMode]);

    const onDetailsClick = React.useCallback((closeMenu: () => void) => {
        return () => {
            closeMenu();
            openDetailsDialog();
        }
    }, [openDetailsDialog]);

    const onDownloadClick = React.useCallback((closeMenu: () => void) => {
        return () => {
            const file = new Blob([model.data.audio.data.bytes], { type: 'audio/wav' });
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = model.attributes.title;
            a.click();
            URL.revokeObjectURL(url);
            closeMenu();
        }
    }, [model]);

    const playButtons = (
        <>
            <IconButton
                color="inherit"
                onClick={onSelectEdit}
            >
                <EditIcon />
            </IconButton>
            <DropdownMenu>
                {(closeMenu) => (
                    [
                        <MenuItem
                            key="details"
                            onClick={onDetailsClick(closeMenu)}
                        >
                            Details
                        </MenuItem>,
                        <MenuItem
                            key="download"
                            onClick={onDownloadClick(closeMenu)}
                        >
                            Download
                        </MenuItem>
                    ]
                )}
            </DropdownMenu>
        </>
    );

    return mode === 'play' ? playButtons : null;
};

export default connector(RecordingPanelButtons);