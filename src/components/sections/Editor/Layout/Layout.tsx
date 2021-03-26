import React from 'react';
import { useTransition } from 'react-spring';
import { makeStyles } from '@material-ui/core/styles';

import EditorBar from './Bar/EditorBar';
import EditorFrame from './Frame/EditorFrame';
import EditorContent from './Content/EditorContent';

import { EditorLayoutProps, EditorPanel } from './Layout.types';

import ChoosePanel from '../Panels/Choose/ChoosePanel';

import RecordingPanel from '../Panels/Recording/RecordingPanel';
import RecordingPanelButtons from '../Panels/Recording/RecordingPanel.buttons';

import NotePanel from '../Panels/Note/NotePanel';
import NotePanelButtons from '../Panels/Note/NotePanel.buttons';

import CategoryPanel from '../Panels/Category/CategoryPanel';
import CategoryPanelButtons from '../Panels/Category/CategoryPanel.buttons';

// Styles

const useEditorLayoutStyles = makeStyles(theme => ({
    categoryEditorPanel: {
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2)
        }
    },
    noteEditorPanel: {
        display: 'flex',
        flexDirection: 'column',
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2)
        }
    },
    recordingEditorPanel: {
        display: 'flex',
        flexDirection: 'column'
    }
}));

// Component

const EditorLayout: React.FC<EditorLayoutProps> = (props) => {
    const {
        attributes,
        context
    } = props;

    const classes = useEditorLayoutStyles();

    const panelTransition = useTransition(context.type, {
        key: context.type,
        initial: { transform: 'translateX(0%)' },
        from: { transform: 'translateX(100%)'},
        enter: { transform: 'translateX(0%)'},
        leave: { transform: 'translateX(-100%)'}
    });
    
    const Panel: EditorPanel = React.useMemo(() => {
        switch (context.type) {
            case "choose":
                return {
                    as: "ul",
                    disableGutters: true,
                    buttons: null,
                    component: <ChoosePanel/>
                };
            case "recording":
                return {
                    as: "div",
                    className: "recordingEditorPanel",
                    disableGutters: true,
                    buttons: (
                        <RecordingPanelButtons 
                            mode={context.mode} 
                        />
                    ),
                    component: (
                        <RecordingPanel
                            mode={context.mode}
                            model={context.data.editing} 
                        />
                    )
                };
            case "note":
                return {
                    as: "div",
                    className: "noteEditorPanel",
                    disableGutters: false,
                    buttons: <NotePanelButtons />,
                    component: (
                        <NotePanel
                            model={context.data.editing}
                        />
                    )
                };
            case "category":
                return {
                    as: "form",
                    className: "categoryEditorPanel",
                    disableGutters: false,
                    buttons: <CategoryPanelButtons />,
                    component: (
                        <CategoryPanel 
                            model={context.data.editing}
                        />
                    )
                };
        }
    }, [context]);

    return (
        <>
            <EditorBar title={attributes.title}>
                {Panel.buttons}
            </EditorBar>
            <EditorFrame>
                {panelTransition((style) => (
                    <EditorContent
                        springStyle={style} 
                        component={Panel.as as React.ElementType}
                        disableGutters={Panel.disableGutters}
                        className={Panel.className ? classes[Panel.className] : ""}
                    >
                        {Panel.component}
                    </EditorContent>
                ))}
            </EditorFrame>
        </>
    )
}

export default EditorLayout;