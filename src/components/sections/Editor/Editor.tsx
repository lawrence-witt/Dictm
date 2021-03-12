import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import FocusDrawer from '../../molecules/Drawers/FocusDrawer';
import EditorLayout from './Layout/Layout';

import CategoryPanel, { CategoryBarButtons } from './Panels/CategoryPanel';
import ChoosePanel from './Panels/ChoosePanel';
import NotePanel, { NoteBarButtons } from './Panels/NotePanel';
import RecordingPanel, { RecordingBarButtons } from './Panels/Recording/RecordingPanel';

import Dialog from './Dialog/Dialog';

import useQueryMatch from '../../../utils/hooks/useQueryMatch';

import { EditorPanel } from './Editor.types';

/* 
*   Editor Variants
*/

const panels: Record<string, EditorPanel> = {
    choose: {
        type: 'choose',
        title: "Choose New Content",
        disableGutters: true,
        component: "ul",
        Content: ChoosePanel
    },
    category: {
        type: 'cat',
        title: "New Category",
        disableGutters: false,
        component: "form",
        className: "categoryEditorContent",
        Buttons: CategoryBarButtons,
        Content: CategoryPanel
    },
    note: {
        type: 'note',
        title: "New Note",
        disableGutters: false,
        component: "div",
        className: "noteEditorContent",
        Buttons: NoteBarButtons,
        Content: NotePanel
    },
    recording: {
        type: 'rec',
        title: "New Recording",
        disableGutters: true,
        component: "div",
        className: "recordingEditorContent",
        Buttons: RecordingBarButtons,
        Content: RecordingPanel
    }
};

/* 
*   Editor Controller
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

const queries = {
    edit: ["choose", "recording", "note", "category"],
    id: []
}

const Editor: React.FC = () => {
    const classes = useStyles();

    // Editor visibility control

    const history = useHistory();
    const editorMatches = useQueryMatch(queries);

    const [editorOpen, setEditorOpen] = React.useState(editorMatches.edit ? true : false);
    const [panel, setPanel] = React.useState(panels[editorMatches.edit || "choose"]);

    React.useEffect(() => {
        const { edit, id } = editorMatches;

        if (edit) {
            setEditorOpen(true);
            setPanel(panels[edit]);
        } else {
            setEditorOpen(false);
        }
    }, [editorMatches]);

    return (
        <FocusDrawer
            open={editorOpen}
            onClose={() => history.push(location.pathname)}
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

export default Editor;