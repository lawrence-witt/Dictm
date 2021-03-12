import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import MenuButton from '../../atoms/Buttons/MenuButton';
import DirectionButton from '../../atoms/Buttons/DirectionButton';

// Types

enum Flows {
    TEMP,
    HYBRID,
    PERM
}

interface MenuHeaderStyleProps {
    isMenuNested: boolean;
    isToggleVisible: boolean;
    isBackButtonVisible: boolean;
}

interface MenuHeaderProps {
    flow?: Flows;
    open?: boolean;
    depth?: number;
    title?: string;
    toggleMenu: () => void;
    reduceDepth: () => void;
}

// Styled

const useHeaderStyles = (props: MenuHeaderStyleProps) => makeStyles(theme => 
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
            display: () => props.isToggleVisible ? 'block' : 'none'
        },
        title: {
            display: () => !props.isToggleVisible ? 'block' : 'none',
            color: 
                props.isMenuNested ? 
                theme.palette.text.primary : 
                theme.palette.primary.main
        },
        backButton: {
            display: () => props.isBackButtonVisible ? 'block' : 'none'
        },
        divider: {
            position: 'absolute',
            width: '100%',
            marginLeft: -theme.spacing(2),
            bottom: 0
        }
    })  
);

// Menu Header

const MenuHeader: React.FC<MenuHeaderProps> = (props) => {
    const {
        flow = Flows.TEMP,
        open = false,
        depth = 0,
        title = "",
        toggleMenu,
        reduceDepth
    } = props;
    
    // Control toggle visibility based on last flow

    const getToggleState = React.useCallback((prevFlow, nextFlow, open) => {
        const isToggleVisible = (nextFlow === Flows.HYBRID && !open) || 
        (nextFlow === Flows.TEMP && prevFlow === Flows.HYBRID);

        return { flow: nextFlow, isToggleVisible };
    }, []);

    const [toggleState, setToggleState] = React.useState(() => getToggleState(flow, flow, open));

    React.useEffect(() => {
        setToggleState(s => getToggleState(s.flow, flow, open));
    }, [flow, open, getToggleState]);

    // Internal selectors

    const { isToggleVisible } = toggleState;
    const isMenuNested = depth >= 2;
    const isBackButtonVisible = isMenuNested && !isToggleVisible;

    const classes = useHeaderStyles({
        isMenuNested,
        isToggleVisible,
        isBackButtonVisible
    })();

    return (
        <Box component="header" className={classes.header}>
            <Divider className={classes.divider}/>
            <MenuButton onClick={toggleMenu} className={classes.menuButton} edge="start"/>
            <ListItemText disableTypography>
                <Typography variant="h6" className={classes.title}>
                    {title}
                </Typography>
            </ListItemText>
            <ListItemSecondaryAction className={classes.backButton}>
                <DirectionButton direction="left" edge="end" onClick={reduceDepth}/>
            </ListItemSecondaryAction>
        </Box>
    )
};

export default MenuHeader;