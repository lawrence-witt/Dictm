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

interface MenuHeaderStyleProps {
    isMenuNested: boolean;
    isToggleVisible: boolean;
    isBackButtonVisible: boolean;
}

interface MenuHeaderProps {
    depth?: number;
    title?: string;
    isToggleVisible?: boolean;
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

const MenuHeader: React.FC<MenuHeaderProps> = ({
    depth = 0, title = "", isToggleVisible = false, toggleMenu
}) => {
    const isMenuNested = depth >= 2;
    const isBackButtonVisible = isMenuNested && !isToggleVisible;

    const classes = useHeaderStyles({
        isMenuNested,
        isToggleVisible,
        isBackButtonVisible
    })();

    const MenuToggle = (
        <MenuButton onClick={toggleMenu} edge="start"/>
    );
    const Title = (
        <ListItemText disableTypography>
            <Typography variant="h6" className={classes.title}>
                {title}
            </Typography>
        </ListItemText>
    );
    const BackButton = (
        <ListItemSecondaryAction className={classes.backButton}>
            <DirectionButton direction="left" edge="end"/>
        </ListItemSecondaryAction>
    )

    return (
        <ListItem component="header" className={classes.header}>
            <Divider className={classes.divider}/>
            {isToggleVisible && MenuToggle}
            {Title}
            {BackButton}
        </ListItem>
    )
};

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

    const isToggleVisible = !isMenuOpen && breakpoint.index === 1;

    return (
        <HybridDrawer 
            flow={breakpoint.index} 
            open={isMenuOpen}
            toggleMenu={toggleMenu}
        >
            <MenuHeader
                depth={depth}
                title={'Lazarus'}
                toggleMenu={toggleMenu} 
                isToggleVisible={isToggleVisible}
            />
        </HybridDrawer>
    );
};

export default NavMenu;