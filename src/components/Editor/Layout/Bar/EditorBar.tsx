import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import DirectionButton from '../../../Buttons/DirectionButton';

import { EditorBarProps } from './EditorBar.types';

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

const EditorBar: React.FC<EditorBarProps> = (props) => {
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
            {children}
        </Toolbar>
    );
};

export default EditorBar;