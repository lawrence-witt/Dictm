import React from 'react';
import { 
    AppBar as MuiAppBar,
    Toolbar,
    IconButton,
    Typography
} from '@material-ui/core';
import {
    Repeat,
    Search,
    Delete
} from '@material-ui/icons';
import { makeStyles, Theme } from '@material-ui/core/styles';

import MenuButton from '../generic/MenuButton';

import { useBreakContext } from '../../utils/hooks/useBreakpoints';

// Types

interface IAppBar {
    toggleMenu: () => void;
}

// Styled

const getSpacing = (theme: Theme) => ({
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        marginRight: theme.spacing(3)
    }
});

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1
    },
    appBar: {
        height: '56px',
        justifyContent: 'center'
    },
    menuButton: {
        ...getSpacing(theme)
    },
    pageTitle: {
        ...getSpacing(theme)
    },
    toolGroup: {
        display: 'flex',
        flexWrap: 'nowrap'
    }
}));

// Component

const AppBar: React.FC<IAppBar> = ({
    toggleMenu
}) => {
    const classes = useStyles();

    const breakpoint = useBreakContext();

    const MenuToggle = (
        <MenuButton 
            edge="start"
            color="inherit"
            className={classes.menuButton}
            onClick={toggleMenu}
        />
    )

    return (
        <MuiAppBar
            elevation={0}
            className={classes.appBar}
        >
            <Toolbar>
                {breakpoint.index === 0 && MenuToggle}
                <Typography 
                    variant="h6" 
                    noWrap
                    className={classes.pageTitle}
                >
                    Page Title
                </Typography>
                <div className={classes.grow}></div>
                <IconButton
                    color="inherit"
                >
                    <Repeat />
                </IconButton>
                <IconButton
                    color="inherit"
                >
                    <Search />
                </IconButton>
                <IconButton
                    color="inherit"
                    edge="end"
                >
                    <Delete />
                </IconButton>
            </Toolbar>
        </MuiAppBar>
    )
};

export default AppBar;