import React from 'react';

import { useTransition, animated } from 'react-spring';

import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';

import NavMenuItem from '../Item/NavMenuItem';

import { NavMenuSwitchProps } from './NavMenuSwitch.types';

// Styled

const useNestedMenuStyles = makeStyles(() => ({
    box: {
        height: '100%',
        position: 'relative'
    },
    list: {
        position: 'absolute',
        width: '100%'
    }
}));

const AnimatedList = animated(List);

// Component

const NavMenuSwitch: React.FC<NavMenuSwitchProps> = (props) => {
    const {
        list,
        animation,
        onNest
    } = props;

    const classes = useNestedMenuStyles();

    const { dir, active } = animation;

    const left = dir === "left";

    const transition = useTransition(list, {
        initial: {transform: 'translateX(0%)'},
        from: active && { transform: `translateX(${left ? '' : '-'}100%)`},
        enter: { transform: 'translateX(0%)'},
        leave: active && { transform: `translateX(${left ? '-' : ''}100%)`}
    });

    return (
        <Box className={classes.box}>
            {transition((style, list) => list && (
                <AnimatedList style={style} disablePadding className={classes.list}>
                    {list.items.map((item, i) => (
                        <NavMenuItem 
                            key={`${i}${item.primary}`}
                            {...item}
                            onNest={onNest}
                        />
                    ))}
                </AnimatedList>
            ))}
        </Box>
    )
}

export default NavMenuSwitch;