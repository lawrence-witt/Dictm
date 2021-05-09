import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import MenuButton from '../../../atoms/Buttons/MenuButton';
import DirectionButton from '../../../atoms/Buttons/DirectionButton';

import { Flows, NavMenuHeaderProps, MenuHeaderStyleProps } from './NavMenuHeader.types';

const useHeaderStyles = makeStyles<Theme, MenuHeaderStyleProps>(theme =>
  createStyles({
    header: {
        height: 56,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: `
            ${theme.spacing(1)}px
            ${theme.spacing(4)}px
            ${theme.spacing(1)}px
            ${theme.spacing(2)}px
        `
    },
    menuButton: {
        display: ({isToggleVisible}) => isToggleVisible ? 'block' : 'none'
    },
    title: {
        display: ({isToggleVisible}) => isToggleVisible ? 'none' : 'block',
        color: ({isMenuNested}) => isMenuNested ? theme.palette.text.primary : theme.palette.primary.main
    },
    backButton: {
        display: ({isBackButtonVisible}) => isBackButtonVisible ? 'block' : 'none'
    },
    divider: {
        position: 'absolute',
        width: '100%',
        marginLeft: -theme.spacing(2),
        bottom: 0
    }
  })  
);

const getToggleState = (prevFlow: Flows, nextFlow: Flows, open: boolean) => {
    const isToggleVisible = (nextFlow === Flows.HYBRID && !open) || 
    (nextFlow === Flows.TEMP && prevFlow === Flows.HYBRID);

    return { flow: nextFlow, isToggleVisible };
}

const NavMenuHeader: React.FC<NavMenuHeaderProps> = (props) => {
    const {
        flow = Flows.TEMP,
        open = false,
        names,
        onUnNest,
        onReset,
        inert = false
    } = props;

    const [toggleState, setToggleState] = React.useState(() => getToggleState(flow, flow, open));

    React.useEffect(() => {
        setToggleState(s => getToggleState(s.flow, flow, open));
    }, [flow, open]);

    const { isToggleVisible } = toggleState;
    const isMenuNested = names.length >= 2;
    const isBackButtonVisible = isMenuNested && !isToggleVisible;

    const classes = useHeaderStyles({
        isMenuNested,
        isToggleVisible,
        isBackButtonVisible
    });

    const onBackButtonClick = React.useCallback(() => onUnNest(1), [onUnNest]);

    const inertAttributes = React.useMemo(() => ({
        tabIndex: inert ? -1 : 0,
        ...(inert ? {"aria-hidden": true} : {})
    }), [inert]);

    return (
        <Box component="header" className={classes.header}>
            <Divider className={classes.divider}/>
            <MenuButton
                onClick={onReset} 
                className={classes.menuButton} 
                edge="start"
                {...inertAttributes}
            />
            <ListItemText disableTypography>
                <Typography variant="h6" className={classes.title}>
                    {names[names.length-1]}
                </Typography>
            </ListItemText>
            <ListItemSecondaryAction className={classes.backButton}>
                <DirectionButton 
                    direction="left" 
                    edge="end" 
                    onClick={onBackButtonClick}
                    {...inertAttributes}
                />
            </ListItemSecondaryAction>
        </Box>
    )
};

export default NavMenuHeader;