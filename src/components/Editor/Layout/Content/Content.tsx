import React from 'react';

import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { animated } from 'react-spring';

import { EditorContentProps } from './Content.types';

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

const AnimatedBox = animated(Box);

const EditorContent: React.FC<EditorContentProps> = (props) => {
    const {
        disableGutters = false,
        className = "",
        style,
        springStyle,
        children,
        ...other
    } = props;

    const classes = useContentStyles({disableGutters});

    return (
        <AnimatedBox
            style={springStyle} 
            className={clsx(classes.drawerContent, className)}
            {...other}
        >
            {children}
        </AnimatedBox>
    );
};

export default EditorContent;