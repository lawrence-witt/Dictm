import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AlbumIcon from '@material-ui/icons/Album';
import EventNoteIcon from '@material-ui/icons/EventNote';

import { editorOperations } from '../../../../../redux/ducks/editor';

/* 
*   Redux
*/

const mapDispatch = {
    openEditor: editorOperations.openEditor
};

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const ChoosePanel: React.FC<ReduxProps> = (props) => {
    const {
        openEditor
    } = props;

    const onChooseRecording = React.useCallback(() => {
        openEditor("recording", "new");
    }, [openEditor]);

    const onChooseNote = React.useCallback(() => {
        openEditor("note", "new");
    }, [openEditor]);

    return (
        <>
            <ListItem 
                button 
                disableGutters 
                onClick={onChooseRecording}
            >
                <ListItemIcon style={{justifyContent: 'center'}}>
                    <AlbumIcon />
                </ListItemIcon>
                <ListItemText primary="Recording"/>
            </ListItem>
            <ListItem 
                button 
                disableGutters
                onClick={onChooseNote}
            >
                <ListItemIcon style={{justifyContent: 'center'}}>
                    <EventNoteIcon />
                </ListItemIcon>
                <ListItemText primary="Note"/>
            </ListItem>
        </>
    )
};

export default connector(ChoosePanel);