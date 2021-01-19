import React from 'react';
import { 
    AppBar as MuiAppBar,
    Toolbar,
    IconButton,
    Typography
} from '@material-ui/core';
import {
    Menu,
    Repeat,
    Search,
    Delete
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1
    },
    appBar: {
        height: '56px',
        justifyContent: 'center'
    },
    menuButton: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            marginRight: theme.spacing(2)
        }
    },
    pageTitle: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            marginRight: theme.spacing(2)
        }
    },
    toolGroup: {
        display: 'flex',
        flexWrap: 'nowrap'
    }
}));

const AppBar: React.FC = () => {
    const classes = useStyles();

    return (
        <MuiAppBar
            elevation={0}
            className={classes.appBar}
        >
            <Toolbar
                variant={'dense'}
            >
                <IconButton 
                    edge="start" 
                    color="inherit"
                    className={classes.menuButton}
                >
                    <Menu/>
                </IconButton>
                <Typography 
                    variant="h6" 
                    noWrap
                    className={classes.pageTitle}
                >
                    Page Title
                </Typography>
                <div className={classes.grow}></div>
                <div className={classes.toolGroup}>
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
                    >
                        <Delete />
                    </IconButton>
                </div>
            </Toolbar>
        </MuiAppBar>
    )
};

export default AppBar;