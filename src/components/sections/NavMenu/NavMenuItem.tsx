import React from 'react';
import { useHistory } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Album from '@material-ui/icons/Album';
import EventNote from '@material-ui/icons/EventNote';
import Category from '@material-ui/icons/Category';
import Settings from '@material-ui/icons/Settings';

import AuthIcon from '../../atoms/Icons/AuthIcon';
import DirectionButton from '../../atoms/Buttons/DirectionButton';

// Types

type IconTypes = 'album' | 'note' | 'category' | 'settings' | 'signout';

interface MenuItem {
    primary: string;
    secondary?: string;
    type: 'link' | 'action';
    value: string;
    icon?: IconTypes;
    divider?: boolean;
    subItems?: MenuItem[];
}

interface NavMenuItemProps extends MenuItem {
    increaseDepth: (primary: string) => void;
}

// Top Level Icons

const iconList: Record<IconTypes, JSX.Element> = {
    album: <Album />,
    note: <EventNote />,
    category: <Category />,
    settings: <Settings />,
    signout: <AuthIcon type="out" />
}

// Styled

const useStyles = makeStyles<Theme, {icon: string | undefined}>(theme => ({
    icon: {
        justifyContent: 'center'
    },
    primary: {
        marginLeft: props => props.icon ? 0 : theme.spacing(2)
    },
    divider: {
        position: 'absolute',
        width: '100%',
        bottom: 0
    }
}));

const NavMenuItem: React.FC<NavMenuItemProps> = props => {
    const {
        primary,
        type,
        value,
        icon,
        divider,
        subItems,
        increaseDepth,
        ...other
    } = props;

    const history = useHistory();
    const classes = useStyles({icon});

    const handlePrimaryClick = (e: React.MouseEvent) => {
        if (type === 'link') {
            history.push(value);
        } else {
            console.log('primary action');
        }
    };

    const handleSecondaryClick = (e: React.MouseEvent) => {
        increaseDepth(primary);
    };

    return (
        <ListItem button disableGutters onClick={handlePrimaryClick} {...other}>
            {icon && <ListItemIcon className={classes.icon}>{iconList[icon]}</ListItemIcon>}
            <ListItemText className={classes.primary} primary={primary}/>
            {divider && <Divider className={classes.divider}/>}
            {subItems && (
                <ListItemSecondaryAction>
                    <DirectionButton onClick={handleSecondaryClick} direction="right" edge="end"/>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    )
};

export default NavMenuItem;