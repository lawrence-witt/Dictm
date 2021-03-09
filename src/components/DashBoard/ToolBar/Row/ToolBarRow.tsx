import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Repeat from '@material-ui/icons/Repeat';
import Search from '@material-ui/icons/Search';
import Delete from '@material-ui/icons/Delete';
import { makeStyles, createStyles, Theme, fade } from '@material-ui/core/styles';

import MenuButton from '../../../Buttons/MenuButton';
import FlexSpace from '../../../Layout/FlexSpace';

import { useBreakContext } from '../../../../utils/hooks/useBreakpoints';

import { DefaultRowProps } from './ToolBarRow.types';

const useDefaultRowStyles = makeStyles<Theme, {
    titleHidden: boolean; 
    menuButtonHidden: boolean
}>(theme => (
    createStyles({
        appBar: {
            position: 'static',
            justifyContent: 'center'
        },
        toolbarRoot: {
            height: '56px',
            minHeight: 'unset'
        },
        toolbarGutters: {
            padding: theme.spacing(0, 2)
        },
        menuButton: {
            display: props => props.menuButtonHidden ? 'none' : 'block',
            marginRight: theme.spacing(1)
        },
        pageTitle: {
            display: props => props.titleHidden ? 'none' : 'block',
            marginRight: theme.spacing(2),
            whiteSpace: 'nowrap'
        },
        leftMostButton: {
            marginLeft: props => props.menuButtonHidden ? theme.spacing(1) : 0
        },
        toolIcon: {
            fill: fade(theme.palette.common.white, 0.7)
        },
        toolIconSelected: {
            fill: theme.palette.common.white
        }
    })
));

const DefaultRow: React.FC<DefaultRowProps> = (props) => {
    const {
        toggleMenu,
        children
    } = props;

    const breakpoint = useBreakContext();

    const titleHidden = React.Children.count(children) > 0 && breakpoint.index < 2; 

    const rowClasses = useDefaultRowStyles({ 
        titleHidden,
        menuButtonHidden: titleHidden || breakpoint.index > 0
    });

    return (
        <AppBar
            elevation={0}
            className={rowClasses.appBar}
        >
        <Toolbar
            classes={{
                root: rowClasses.toolbarRoot,
                gutters: rowClasses.toolbarGutters
            }}
        >
            <MenuButton 
                edge="start"
                color="inherit"
                className={rowClasses.menuButton}
                onClick={toggleMenu}
            />
            <Typography 
                variant="h6"
                className={rowClasses.pageTitle}
            >
                Page Title
            </Typography>
            <FlexSpace flex={titleHidden ? 0 : 1} />
            {children}
            <FlexSpace flex={1} />
            <IconButton
                color="inherit"
                className={rowClasses.leftMostButton}
            >
                <Repeat 
                    className={rowClasses.toolIcon}
                />
            </IconButton>
            <IconButton
                color="inherit"
            >
                <Search 
                    className={rowClasses.toolIcon}
                />
            </IconButton>
            <IconButton
                edge="end"
                color="inherit"
            >
                <Delete 
                    className={rowClasses.toolIcon}
                />
            </IconButton>
        </Toolbar>
        </AppBar>
    )
}

export default DefaultRow;