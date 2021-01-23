import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import MenuButton from '../generic/MenuButton';
import HybridDrawer from '../generic/HybridDrawer';
import DirectionButton from '../generic/DirectionButton';

import { useBreakContext } from '../../utils/hooks/useBreakpoints';

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
}

interface NavMenuProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
}

// Styled

const useHeaderStyles = (props: MenuHeaderStyleProps) => makeStyles(theme => 
    createStyles({
        header: {
            height: 56,
            width: '100%',
            position: 'relative'
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

const MenuHeader: React.FC<MenuHeaderProps> = React.memo(function MenuHeader({
    flow = Flows.TEMP, open = false, depth = 0, title = "", toggleMenu
}) {
    
    // Control toggle visibility based on last flow

    const getHeaderState = React.useCallback((prevFlow, nextFlow, open) => {
        const isToggleVisible = (nextFlow === Flows.HYBRID && !open) || 
        (nextFlow === Flows.TEMP && prevFlow === Flows.HYBRID);

        return { flow: nextFlow, isToggleVisible };
    }, []);

    const [headerState, setHeaderState] = React.useState(() => getHeaderState(flow, flow, open));

    React.useEffect(() => {
        setHeaderState(s => getHeaderState(s.flow, flow, open));
    }, [flow, open, getHeaderState]);

    // Internal selectors

    const { isToggleVisible } = headerState;
    const isMenuNested = depth >= 2;
    const isBackButtonVisible = isMenuNested && !isToggleVisible;

    const classes = useHeaderStyles({
        isMenuNested,
        isToggleVisible,
        isBackButtonVisible
    })();

    return (
        <ListItem component="header" className={classes.header}>
            <Divider className={classes.divider}/>
            <MenuButton onClick={toggleMenu} className={classes.menuButton} edge="start"/>
            <ListItemText disableTypography>
                <Typography variant="h6" className={classes.title}>
                    {title}
                </Typography>
            </ListItemText>
            <ListItemSecondaryAction className={classes.backButton}>
                <DirectionButton direction="left" edge="end"/>
            </ListItemSecondaryAction>
        </ListItem>
    )
});

// Menu List

// Menu Item

// Nav Menu

const NavMenu: React.FC<NavMenuProps> = ({
    isMenuOpen, toggleMenu
}) => {

    const breakpoint = useBreakContext();
    const depth = React.useMemo(() => {
        return isMenuOpen ? 1 : 0;
    }, [isMenuOpen]);

    return (
        <HybridDrawer 
            flow={breakpoint.index} 
            open={isMenuOpen}
            onClose={toggleMenu}
        >
            <MenuHeader
                flow={breakpoint.index}
                open={isMenuOpen}
                depth={depth}
                title={'Lazarus'}
                toggleMenu={toggleMenu}
            />
            <ListItem>
                <ListItemText primary="test value text"/>
            </ListItem>
        </HybridDrawer>
    );
};

export default NavMenu;