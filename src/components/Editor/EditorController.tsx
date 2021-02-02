import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import FocusDrawer from '../Drawers/FocusDrawer';
import { EditorBar, EditorFrame, EditorContent } from './EditorLayout';
import CategoryEditor, { CategoryButtons } from './Panels/CategoryEditor';
import ChooseEditor from './Panels/ChooseEditor';
import NoteEditor, { NoteButtons } from './Panels/NoteEditor';

type EditorContentClasses = 
    'categoryEditorContent' | 
    'noteEditorContent';

interface EditorPanel {
    title: string;
    disableGutters: boolean;
    component: string;
    className?: EditorContentClasses;
    Buttons?: React.FC,
    Content: React.FC
}

const panels: Record<string, EditorPanel> = {
    category: {
        title: "New Category",
        disableGutters: false,
        component: "form",
        className: "categoryEditorContent",
        Buttons: CategoryButtons,
        Content: CategoryEditor
    },
    choose: {
        title: "Choose New Content",
        disableGutters: true,
        component: "ul",
        Content: ChooseEditor
    },
    note: {
        title: "New Note",
        disableGutters: false,
        component: "div",
        className: "noteEditorContent",
        Buttons: NoteButtons,
        Content: NoteEditor
    }
};

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
    }
}))

const EditorController: React.FC = () => {
    const [panel, setPanel] = React.useState(panels.note);

    const { 
        title, 
        disableGutters, 
        component, 
        className,
        Buttons,
        Content
    } = panel;

    const classes = useStyles();

    return (
        <FocusDrawer open={true}>
            <EditorBar title={title}>
                {Buttons && <Buttons />}
            </EditorBar>
            <EditorFrame>
                <EditorContent 
                    component={component as React.ElementType}
                    disableGutters={disableGutters}
                    className={className && classes[className]}
                >
                    <Content />
                </EditorContent>
            </EditorFrame>
        </FocusDrawer>
    )
};

export default EditorController;