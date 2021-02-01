import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import EditorDrawer, { EditorDrawerBar, EditorDrawerFrame, EditorDrawerContent } from '../../Drawers/EditorDrawer';
import ChooseEditor from './Panels/ChooseEditor';
import NoteEditor from './Panels/NoteEditor';

const panels = {
    choose: {
        title: "Choose New Content",
        disableGutters: true,
        component: "ul",
        className: "",
        Content: ChooseEditor
    },
    note: {
        title: "New Note",
        disableGutters: false,
        component: "div",
        className: "noteDrawerContent" as const,
        Content: NoteEditor
    }
};

const useStyles = makeStyles(theme => ({
    noteDrawerContent: {
        display: 'flex',
        flexDirection: 'column',
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2)
        }
    }
}))

const MediaEditor: React.FC = () => {
    const [panel, setPanel] = React.useState(panels.note);
    const { title, disableGutters, component, className, Content } = panel;

    const classes = useStyles();

    return (
        <EditorDrawer>
            <EditorDrawerBar title={title}>

            </EditorDrawerBar>
            <EditorDrawerFrame>
                <EditorDrawerContent 
                    component={component as React.ElementType}
                    disableGutters={disableGutters}
                    className={className && classes[className]}
                >
                    <Content />
                </EditorDrawerContent>
            </EditorDrawerFrame>
        </EditorDrawer>
    )
};

export default MediaEditor;