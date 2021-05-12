import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import MenuItem from '@material-ui/core/MenuItem';

import DropdownMenu from '../../../../../molecules/DropdownMenu/DropdownMenu';

import { RecordingEditorButtonsProps } from './RecordingEditorButtons.types';

const RecordingEditorButtons: React.FC<RecordingEditorButtonsProps> = (props) => {
    const {
        model,
        updateMode,
        openDetailsDialog
    } = props;

    const onSelectEdit = React.useCallback(() => updateMode("edit"), [updateMode]);

    const onDetailsClick = React.useCallback((closeMenu: () => void) => {
        return () => {
            openDetailsDialog();
            closeMenu();
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

    return (
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
};

export default RecordingEditorButtons;