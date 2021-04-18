import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { toolSelectors, toolOperations, NavMenuLists } from '../../../redux/ducks/tools';

import { useBreakContext } from '../../../lib/hooks/useBreakpoints';

import HybridDrawer from '../../molecules/HybridDrawer/HybridDrawer';

import NavMenuSwitch from './Switch/NavMenuSwitch';
import NavMenuHeader from './Header/NavMenuHeader';

import { NavMenuState } from './NavMenu.types';

/* 
*   Redux
*/

const mapState = (state: RootState, props: RouteComponentProps) => ({
    isMenuOpen: state.tools.menu.isOpen,
    navLists: toolSelectors.getNavLists(
        state.user, state.content.categories, props.history.push
    )
});

const mapDispatch = {
    onToggleMenu: toolOperations.toggleNavMenu
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const createMenu = (
    lists: NavMenuLists
): NavMenuState => {
    const initial = lists[Object.keys(lists)[0]];

    return {
        ids: [initial.id],
        names: [initial.name],
        list: initial,
        animation: {
            dir: 'left',
            active: false
        }
    }
}

const refreshMenu = (
    m: NavMenuState,
    lists: NavMenuLists
): NavMenuState => {
    return {
        ...m,
        list: lists[m.ids[m.ids.length-1]],
        animation: {
            ...m.animation,
            active: false
        }
    }
}

const nestMenu = (
    m: NavMenuState,
    lists: NavMenuLists,
    to: string
): NavMenuState => ({
    ids: [...m.ids, lists[to].id],
    names: [...m.names, lists[to].name],
    list: lists[to],
    animation: {
        dir: 'left',
        active: true
    }
});

const unNestMenu = (
    m: NavMenuState,
    lists: NavMenuLists,
    levels: number
): NavMenuState => {
    if (m.ids.length - levels < 1) return m;
            
    const ids = m.ids.slice(0, m.ids.length - levels);
    const names = m.names.slice(0, m.names.length - levels);

    return {
        ids,
        names,
        list: lists[ids[ids.length-1]],
        animation: {
            dir: 'right',
            active: true
        }
    }
}

const resetMenu = (
    m: NavMenuState,
    lists: NavMenuLists,
): NavMenuState => ({
    ids: [m.ids[0]],
    names: [m.names[0]],
    list: lists[m.ids[0]],
    animation: {
        dir: 'right',
        active: false
    }
});

const NavMenu: React.FC<ReduxProps> = (props) => {
    const {
        isMenuOpen,
        navLists,
        onToggleMenu
    } = props;

    const breakpoints = useBreakContext();

    const [menu, setMenu] = React.useState<NavMenuState>(() => createMenu(navLists));

    const onNest = React.useCallback((to: string) => {
        setMenu(m => nestMenu(m, navLists, to))
    }, [navLists]);

    const onUnNest = React.useCallback((levels: number) => {
        setMenu(m => unNestMenu(m, navLists, levels))
    }, [navLists]);

    const onReset = React.useCallback(() => {
        onToggleMenu();
        setMenu(m => {
            if (!isMenuOpen || m.ids.length === 1) return m;
            return resetMenu(m, navLists);
        });
    }, [isMenuOpen, navLists, onToggleMenu]);

    React.useEffect(() => {
        setMenu(m => refreshMenu(m, navLists));
    }, [navLists]);

    return (
        <HybridDrawer
            flow={breakpoints.index}
            open={isMenuOpen}
            onClose={onReset}
        >
            <NavMenuHeader 
                flow={breakpoints.index}
                open={isMenuOpen}
                names={menu.names}
                onUnNest={onUnNest}
                onReset={onReset}
            />
            <NavMenuSwitch 
                list={menu.list}
                animation={menu.animation}
                onNest={onNest}  
            />
        </HybridDrawer>
    )
}

export default withRouter(connector(NavMenu));