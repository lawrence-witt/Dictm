import React from 'react';
import clsx from 'clsx';
import { animated, SpringValue } from 'react-spring';
import Drawer from '@material-ui/core/Drawer';
import Box, { BoxProps } from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import DirectionButton from '../Buttons/DirectionButton';

/* TYPES */

interface EditorDrawerBarProps {
    title?: string;
}

interface EditorDrawerContentProps extends BoxProps {
    disableGutters?: boolean;
    springStyle?: {
        transform: SpringValue<string>;
    }
}

/* EDITOR DRAWER */

// Styled

const useDrawerStyles = makeStyles(theme => ({
    paper: {
        width: '100%',
        maxWidth: 450,
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
        position: 'sticky',
        top: 0,
        height: 56,
        minHeight: 'unset',
        background: theme.palette.background.paper,
        zIndex: theme.zIndex.appBar,
        padding: `0px ${theme.spacing(2)}px`,
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

/* EDITOR DRAWER FRAME */

// Styles

const useFrameStyles = makeStyles({
    drawerFrame: {
        position: 'relative',
        height: '100%',
        width: '100%'
    }
})

// Component

const EditorDrawerFrame: React.FC = (props) => {
    const { 
        children 
    } = props;

    const classes = useFrameStyles();

    return (
        <Box className={classes.drawerFrame}>
            {children}
        </Box>
    )
}

/* EDITOR DRAWER CONTENT */

// Styled

const useContentStyles = makeStyles<Theme, {disableGutters: boolean}>(theme => 
    createStyles({
        drawerContent: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            margin: 0,
            padding: ({disableGutters: dg}) => dg ? 0 : `0px ${theme.spacing(2)}px`,
        }
    })
);

// Component

const AnimatedBox = animated(Box);

const EditorDrawerContent: React.FC<EditorDrawerContentProps> = (props) => {
    const {
        disableGutters = false,
        className = "",
        springStyle,
        children,
        ...other
    } = props;

    const classes = useContentStyles({disableGutters});

    return (
        <AnimatedBox
            {...other}
            style={springStyle} 
            className={clsx(classes.drawerContent, className)}
        >
            {children}
        </AnimatedBox>
    );
};

/* EXPORTS */

export { EditorDrawerBar, EditorDrawerFrame, EditorDrawerContent };
export default EditorDrawer;