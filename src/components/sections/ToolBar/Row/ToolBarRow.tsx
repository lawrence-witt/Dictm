import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../redux/store';
import { navigationOperations } from '../../../../redux/ducks/navigation';
import { toolOperations } from '../../../../redux/ducks/tools';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Repeat from '@material-ui/icons/Repeat';
import Search from '@material-ui/icons/Search';
import Delete from '@material-ui/icons/Delete';
import { makeStyles, createStyles, Theme, fade } from '@material-ui/core/styles';

import MenuButton from '../../../atoms/Buttons/MenuButton'
import FlexSpace from '../../../atoms/FlexSpace/FlexSpace';

import { useBreakContext } from '../../../../lib/hooks/useBreakpoints';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    pageTitle: state.navigation.history.current.title,
    searchIsOpen: state.tools.search.isOpen,
    deleteIsOpen: state.tools.delete.isOpen
});

const mapDispatch = {
    onToggleMenu: navigationOperations.toggleNavMenu,
    onToggleSearch: toolOperations.toggleSearchTool,
    onToggleDelete: toolOperations.toggleDeleteTool
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

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

const ToolBarRow: React.FC<ReduxProps> = (props) => {
    const {
        pageTitle,
        searchIsOpen,
        deleteIsOpen,
        onToggleSearch,
        onToggleDelete,
        onToggleMenu,
        children
    } = props;

    const breakpoint = useBreakContext();

    const titleHidden = React.Children.count(children) > 0 && breakpoint.index < 2;

    const classes = useDefaultRowStyles({ 
        titleHidden,
        menuButtonHidden: titleHidden || breakpoint.index > 0
    });

    const searchClass = searchIsOpen ? classes.toolIconSelected : classes.toolIcon;
    const deleteClass = deleteIsOpen ? classes.toolIconSelected : classes.toolIcon;

    return (
        <AppBar
            elevation={0}
            className={classes.appBar}
        >
        <Toolbar
            classes={{
                root: classes.toolbarRoot,
                gutters: classes.toolbarGutters
            }}
        >
            <MenuButton 
                edge="start"
                color="inherit"
                className={classes.menuButton}
                onClick={onToggleMenu}
            />
            <Typography 
                variant="h6"
                className={classes.pageTitle}
            >
                {pageTitle}
            </Typography>
            <FlexSpace flex={titleHidden ? 0 : 1} />
            {children}
            <FlexSpace flex={1} />
            <IconButton
                color="inherit"
                className={classes.leftMostButton}
            >
                <Repeat 
                    className={classes.toolIcon}
                />
            </IconButton>
            <IconButton
                color="inherit"
                onClick={onToggleSearch}
            >
                <Search 
                    className={searchClass}
                />
            </IconButton>
            <IconButton
                edge="end"
                color="inherit"
                onClick={onToggleDelete}
            >
                <Delete 
                    className={deleteClass}
                />
            </IconButton>
        </Toolbar>
        </AppBar>
    )
}

export default connector(ToolBarRow);