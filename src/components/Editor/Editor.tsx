import React from 'react';
import { useTransition } from 'react-spring';
import { makeStyles } from '@material-ui/core/styles';

import FocusDrawer from '../Drawers/FocusDrawer';
import EditorBar from './Layout/Bar/Bar';
import EditorFrame from './Layout/Frame/Frame';
import EditorContent from './Layout/Content/Content';
import CategoryEditor, { CategoryBarButtons } from './Panels/CategoryEditor';
import ChooseEditor from './Panels/ChooseEditor';
import NoteEditor, { NoteBarButtons } from './Panels/NoteEditor';
import RecordingEditor, { RecordingBarButtons } from './Panels/RecordingEditor/RecordingEditor';

import { PanelTypes, EditorContentClasses, EditorPanel } from './Editor.types';

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
        Content: CategoryEditor
    },
    choose: {
        type: 'choose',
        title: "Choose New Content",
        disableGutters: true,
        component: "ul",
        Content: ChooseEditor
    },
    note: {
        type: 'note',
        title: "New Note",
        disableGutters: false,
        component: "div",
        className: "noteEditorContent",
        Buttons: NoteBarButtons,
        Content: NoteEditor
    },
    recording: {
        type: 'rec',
        title: "New Recording",
        disableGutters: true,
        component: "div",
        className: "recordingEditorContent",
        Buttons: RecordingBarButtons,
        Content: RecordingEditor
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
    const [panel, setPanel] = React.useState(panels.recording);
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
        <FocusDrawer open={false}>
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
        </FocusDrawer>
    )
};

export default Editor;