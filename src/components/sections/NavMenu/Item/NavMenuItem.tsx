import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import { makeStyles, Theme } from '@material-ui/core/styles';

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
            {icon && <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>}
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