import React from 'react';

import { useTransition, animated } from 'react-spring';

import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import ChoosePanel from './Choose/ChoosePanel';
import RecordingPanel from './Recording/RecordingPanel';
import NotePanel from './Note/NotePanel';
import CateogryPanel from './Category/CategoryPanel';

import { EditorPanelProps, EditorPanelSwitchProps } from './EditorPanel.types';

/* Styled */

const useStyles = makeStyles(theme => ({
    frame: {
        position: 'relative',
        height: '100%',
        width: '100%'
    },
    slide: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        margin: 0
    },
    choose: {
        padding: 0
    },
    recording: {
        display: 'flex',
        flexDirection: "column",
        padding: 0
    },
    note: {
        display: 'flex',
        flexDirection: 'column',
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2)
        },
        padding: `0px ${theme.spacing(2)}px`
    },
    category: {
        "& > *:not(:last-child)": {
            marginBottom: theme.spacing(2)
        },
        padding: `0px ${theme.spacing(2)}px`
    },
}));

const componentTypes = {
    choose: { as: "ul" },
    recording: { as: "div" },
    note: { as: "div" },
    category: { as: "form" }
}

/* Components */

const EditorPanelSwitch = React.memo(function EditorPanelSwitch(
    {displayType, context}: EditorPanelSwitchProps
) {
    if (displayType !== context.type) return null;

    switch(context.type) {
        case "choose":
            return <ChoosePanel />;
        case "recording":
            return (
                <RecordingPanel 
                    mode={context.mode}
                    model={context.data.editing} 
                />
            );
        case "note":
            return (
                <NotePanel
                    model={context.data.editing}
                />
            );
        case "category":
            return (
                <CateogryPanel
                    model={context.data.editing}
                />
            );
        default:
            return null;
    }
    
}, (prev, next) => {
    // Node should only ever display context it was initialised with
    if (prev.displayType !== next.context.type) return true;
    return false;
});

const AnimatedBox = animated(Box);

const EditorPanel: React.FC<EditorPanelProps> = (props) => {
    const {
        context
    } = props;

    const classes = useStyles();

    const panelTransition = useTransition(context.type, {
        initial: { transform: 'translateX(0%)' },
        from: { transform: 'translateX(100%)'},
        enter: { transform: 'translateX(0%)'},
        leave: { transform: 'translateX(-100%)'}
    });

    return (
        <div className={classes.frame}>
            {panelTransition((style, item) => (
                <AnimatedBox
                    component={componentTypes[item].as as React.ElementType}
                    style={style}
                    className={clsx(classes.slide, classes[item])}
                >
                    <EditorPanelSwitch displayType={item} context={context}/>
                </AnimatedBox>
            ))}
        </div>
    )
}

export default EditorPanel;