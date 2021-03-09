import React from 'react';
import { useTransition } from 'react-spring';
import { makeStyles } from '@material-ui/core/styles';

import FocusDrawer from '../Drawers/FocusDrawer';
import EditorBar from './Layout/Bar/EditorBar';
import EditorFrame from './Layout/Frame/EditorFrame';
import EditorContent from './Layout/Content/EditorContent';

import CategoryPanel, { CategoryBarButtons } from './Panels/CategoryPanel';
import ChoosePanel from './Panels/ChoosePanel';
import NotePanel, { NoteBarButtons } from './Panels/NotePanel';
import RecordingPanel, { RecordingBarButtons } from './Panels/Recording/RecordingPanel';

import Dialog from './Dialog/Dialog';

import { EditorPanel } from './Editor.types';

/* 
*   Editor Variants
*/

const panels: Record<string, EditorPanel> = {
    category: {
        type: 'cat',
        title: "New Category",
        disableGutters: false,
        component: "form",
        className: "categoryEditorContent",
        Buttons: CategoryBarButtons,
        Content: CategoryPanel
    },
    choose: {
        type: 'choose',
        title: "Choose New Content",
        disableGutters: true,
        component: "ul",
        Content: ChoosePanel
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

const Editor: React.FC = () => {
    const [panel, setPanel] = React.useState(panels.note);
    const { title, Buttons } = panel;

    const classes = useStyles();

    const panelTransition = useTransition(panel, {
        key: panel.type,
        initial: { transform: 'translateX(0%)' },
        from: { transform: 'translateX(100%)'},
        enter: { transform: 'translateX(0%)'},
        leave: { transform: 'translateX(-100%)'}
    });

    return (
        <FocusDrawer
            open={false}
        >
            <EditorBar title={title}>
                {Buttons && <Buttons />}
            </EditorBar>
            <EditorFrame>
                {panelTransition((style, item) => {
                    const { disableGutters, component, className, Content } = item;

                    return (
                        <EditorContent
                            springStyle={style} 
                            component={component as React.ElementType}
                            disableGutters={disableGutters}
                            className={className && classes[className]}
                        >
                            <Content />
                        </EditorContent>
                    )
                })}
            </EditorFrame>
            <Dialog 
                open={true}
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