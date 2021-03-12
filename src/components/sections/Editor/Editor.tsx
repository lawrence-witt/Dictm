import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { RootState } from '../../../redux/store';
import { editorOperations } from '../../../redux/ducks/editor';

import FocusDrawer from '../../molecules/Drawers/FocusDrawer';
import EditorLayout from './Layout/Layout';

import Dialog from './Dialog/Dialog';

import { Panels } from './Editor.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    editor: state.editor
});

const mapDispatch = {
    closeEditor: editorOperations.closeEditor
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/
 
const useStyles = makeStyles(theme => ({
    categoryEditorContent: {
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2)
        }
    },
    noteEditorContent: {
        display: 'flex',
        flexDirection: 'column',
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2)
        }
    },
    recordingEditorContent: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

const Editor: React.FC<ReduxProps> = (props) => {
    const {
        editor,
        closeEditor
    } = props;

    const classes = useStyles();

    // Editor visibility control

    const [editorOpen, setEditorOpen] = React.useState(Boolean(editor.editorType));
    const [panel, setPanel] = React.useState(Panels[editor.editorType || "choose"]);

    React.useEffect(() => {
        if (editor.editorType) {
            setEditorOpen(true);
            setPanel(Panels[editor.editorType]);
        } else {
            setEditorOpen(false);
        }
    }, [editor.editorType]);

    // Handle editor close

    const onRequestEditorClosed = React.useCallback(() => {
        closeEditor();
    }, [closeEditor]);

    return (
        <FocusDrawer
            open={editorOpen}
            onClose={onRequestEditorClosed}
            SlideProps={{
                mountOnEnter: true,
                unmountOnExit: true
            }}
        >
            <EditorLayout 
                panel={panel}
                className={panel.className ? classes[panel.className] : ""}
            />
            <Dialog 
                open={false}
                schema={{
                    type: 'save',
                    props: {
                        contentType: 'recording',
                        newContent: false
                    }
                }}
            />
        </FocusDrawer>
    )
};

export default connector(Editor);