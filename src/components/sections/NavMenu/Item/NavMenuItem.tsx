import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Album from '@material-ui/icons/Album';
import EventNote from '@material-ui/icons/EventNote';
import Category from '@material-ui/icons/Category';
import Settings from '@material-ui/icons/Settings';
import { makeStyles, Theme } from '@material-ui/core/styles';

import AuthIcon from '../../../atoms/Icons/AuthIcon';

import DirectionButton from '../../../atoms/Buttons/DirectionButton';

import { NavMenuItemProps } from './NavMenuItem.types';

const useStyles = makeStyles<Theme, {icon: boolean}>(theme => ({
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

const iconMap: Record<string, JSX.Element> = {
    recordings: <Album />,
    notes: <EventNote />,
    categories: <Category />,
    settings: <Settings />,
    signout: <AuthIcon type="out" />
}

const NavMenuItem: React.FC<NavMenuItemProps> = (props) => {
    const {
        primary,
        icon,
        to,
        divider,
        onClick,
        onNest
    } = props;

    const classes = useStyles({ icon: icon ? true : false });

    return (
        <ListItem button disableGutters onClick={onClick}>
            {icon && <ListItemIcon className={classes.icon}>{iconMap[icon]}</ListItemIcon>}
            <ListItemText className={classes.primary} primary={primary}/>
            {divider && <Divider className={classes.divider}/>}
            {to && (
                <ListItemSecondaryAction>
                    <DirectionButton onClick={() => onNest && onNest(to)} direction="right" edge="end"/>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    )
}

export default NavMenuItem;