import React from 'react';
import { useTransition } from 'react-spring';
import { makeStyles } from '@material-ui/core/styles';

import FocusDrawer from '../Drawers/FocusDrawer';
import { EditorBar, EditorFrame, EditorContent } from './EditorLayout';
import CategoryEditor, { CategoryButtons } from './Panels/CategoryEditor';
import ChooseEditor from './Panels/ChooseEditor';
import NoteEditor, { NoteButtons } from './Panels/NoteEditor';

type PanelTypes = 'cat' | 'choose' | 'note' | 'rec';

type EditorContentClasses = 
    'categoryEditorContent' | 
    'noteEditorContent';

interface EditorPanel {
    type: PanelTypes;
    title: string;
    disableGutters: boolean;
    component: string;
    className?: EditorContentClasses;
    Buttons?: React.FC,
    Content: React.FC
}

const panels: Record<string, EditorPanel> = {
    category: {
        type: 'cat',
        title: "New Category",
        disableGutters: false,
        component: "form",
        className: "categoryEditorContent",
        Buttons: CategoryButtons,
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
    const [panel, setPanel] = React.useState(panels.choose);
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
        <FocusDrawer open={true}>
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

export default EditorController;