import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Repeat from '@material-ui/icons/Repeat';
import Search from '@material-ui/icons/Search';
import Delete from '@material-ui/icons/Delete';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import MenuButton from '../Buttons/MenuButton';

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

const useStyles = makeStyles<Theme, {buttonVisible: boolean}>(theme => (
    createStyles({
        grow: {
            flexGrow: 1
        },
        appBar: {
            height: '56px',
            justifyContent: 'center'
        },
        menuButton: {
            display: props => props.buttonVisible ? 'block' : 'none',
            ...getSpacing(theme),
        },
        pageTitle: {
            ...getSpacing(theme)
        },
        toolGroup: {
            display: 'flex',
            flexWrap: 'nowrap'
        }
    })
));

// Component

const PageBar: React.FC<IAppBar> = ({
    toggleMenu
}) => {
    const breakpoint = useBreakContext();
    const classes = useStyles({
        buttonVisible: breakpoint.index === 0
    });

    return (
        <AppBar
            elevation={0}
            className={classes.appBar}
        >
            <Toolbar>
                <MenuButton 
                    edge="start"
                    color="inherit"
                    className={classes.menuButton}
                    onClick={toggleMenu}
                />
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
        </AppBar>
    )
};

export default PageBar;