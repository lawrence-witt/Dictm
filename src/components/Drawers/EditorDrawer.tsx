import React from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import Box, { BoxProps } from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import DirectionButton from '../Buttons/DirectionButton';

/* TYPES */

interface EditorDrawerBarProps {
    title?: string;
}

/* EDITOR DRAWER */

// Styled

const useDrawerStyles = makeStyles(theme => ({
    paper: {
        width: '100%',
        maxWidth: 450,
        padding: `0px ${theme.spacing(2)}px`,
        overflowX: 'hidden'
    }
}));

// Component

const EditorDrawer: React.FC = (props) => {
    const {
        children
    } = props;

    const classes = useDrawerStyles();

    return (
        <Drawer 
            anchor="right"
            elevation={8}
            classes={classes}
            open={true}
        >
            {children}
        </Drawer>
    );
};

/* EDITOR DRAWER TOP BAR */

// Styled

const useBarStyles = makeStyles(theme => ({
    drawerBar: {
        height: 56,
        minHeight: 'unset',
        padding: 0
    },
    backButton: {
        marginRight: theme.spacing(1)
    },
    editorTitle: {
        marginRight: theme.spacing(1)
    },
    grow: {
        flex: 1
    }
}));

// Component

const EditorDrawerBar: React.FC<EditorDrawerBarProps> = (props) => {
    const {
        title = "",
        children
    } = props;

    const classes = useBarStyles();

    return (
        <Toolbar className={classes.drawerBar}>
            <DirectionButton 
                design="arrow" 
                direction="left"
                edge="start"
                color="inherit"
                className={classes.backButton}
            />
            <Typography
                variant="h6" 
                noWrap
                className={classes.editorTitle}
            >
                {title}
            </Typography>
            <div className={classes.grow}></div>
            {React.Children.map(children, (child, i) => {
                if (i + 1 === React.Children.count(children)) {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, {edge: 'end'});
                    }
                }
                return child;
            })}
        </Toolbar>
    );
};

/* EDITOR DRAWER CONTENT */

// Styled

const useContentStyles = makeStyles(() => ({
    drawerContent: {
        position: 'relative',
        height: '100%',
        width: '100%'
    }
}));

// Component

const EditorDrawerContent: React.FC<BoxProps> = (props) => {
    const {
        className,
        children,
        ...other
    } = props;

    const classes = useContentStyles();

    return (
        <Box {...other} className={clsx(classes.drawerContent, className)}>
            {children}
        </Box>
    );
};

/* EXPORTS */

export { EditorDrawerBar, EditorDrawerContent };
export default EditorDrawer;