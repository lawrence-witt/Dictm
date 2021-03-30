import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { toolSelectors, toolOperations } from '../../../redux/ducks/tools';

import Album from '@material-ui/icons/Album';
import EventNote from '@material-ui/icons/EventNote';
import Category from '@material-ui/icons/Category';
import Settings from '@material-ui/icons/Settings';

import AuthIcon from '../../atoms/Icons/AuthIcon';

import NavMenuSwitch from './Switch/NavMenuSwitch';
import NavMenuHeader from './Header/NavMenuHeader';

import HybridDrawer from '../../molecules/Drawers/HybridDrawer';

import { useBreakContext } from '../../../utils/hooks/useBreakpoints';

import { IconTypes, NavMenuLists, NavMenuState } from './NavMenu.types';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    isMenuOpen: state.tools.nav.menu.isOpen,
    navLists: toolSelectors.getNavLists(state.user, state.categories)
});

const mapDispatch = {
    onToggleMenu: toolOperations.toggleNavMenu
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const iconMap: Record<IconTypes, JSX.Element> = {
    recordings: <Album />,
    notes: <EventNote />,
    categories: <Category />,
    settings: <Settings />,
    signout: <AuthIcon type="out" />
}

const mapListActions = (
    history: ReturnType<typeof useHistory>, 
    lists: ReturnType<typeof toolSelectors.getNavLists>
): NavMenuLists => {
    return {
        main: {
            ...lists.main,
            items: lists.main.items.map(item => {
                switch (item.id) {
                    case "recordings":
                    case "notes":
                    case "categories":
                    case "settings":
                        return {
                            ...item,
                            icon: iconMap[item.id],
                            onClick: () => history.push("/"+item.id) 
                        }
                    case "signout":
                        return {
                            ...item,
                            icon: iconMap[item.id]
                        }
                    default: return item;
                }
            })
        },
        categories: {
            ...lists.categories,
            items: lists.categories.items.map(item => {
                return { 
                    ...item, 
                    onClick: () => history.push("/categories/"+item.id) 
                }
            })
        }
    }
}

const createMenu = (
    history: ReturnType<typeof useHistory>, 
    lists: ReturnType<typeof toolSelectors.getNavLists>
): NavMenuState => {
    const mapped = mapListActions(history, lists);
    const initial = mapped[Object.keys(mapped)[0]];

    return {
        ids: [initial.id],
        names: [initial.name],
        list: initial,
        lists: mapped,
        animation: {
            dir: 'left',
            active: false
        }
    }
}

const refreshMenu = (
    m: NavMenuState,
    history: ReturnType<typeof useHistory>, 
    lists: ReturnType<typeof toolSelectors.getNavLists>
): NavMenuState => {
    const mapped = mapListActions(history, lists);

    return {
        ...m,
        list: mapped[m.ids[m.ids.length-1]],
        lists: mapped,
        animation: {
            ...m.animation,
            active: false
        }
    }
}

const nestMenu = (
    m: NavMenuState,
    to: string
): NavMenuState => ({
    ...m,
    ids: [...m.ids, m.lists[to].id],
    names: [...m.names, m.lists[to].name],
    list: m.lists[to],
    animation: {
        dir: 'left',
        active: true
    }
});

const unNestMenu = (
    m: NavMenuState,
    levels: number
): NavMenuState => {
    if (m.ids.length - levels < 1) return m;
            
    const ids = m.ids.slice(0, m.ids.length - levels);
    const names = m.names.slice(0, m.names.length - levels);

    return {
        ...m,
        ids,
        names,
        list: m.lists[ids[ids.length-1]],
        animation: {
            dir: 'right',
            active: true
        }
    }
}

const resetMenu = (
    m: NavMenuState
): NavMenuState => ({
    ...m,
    ids: [m.ids[0]],
    names: [m.names[0]],
    list: m.lists[m.ids[0]],
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

    const history = useHistory();

    const [menu, setMenu] = React.useState<NavMenuState>(() => createMenu(history, navLists));

    const onNest = React.useCallback((to: string) => setMenu(m => nestMenu(m, to)), []);

    const onUnNest = React.useCallback((levels: number) => setMenu(m => unNestMenu(m, levels)), []);

    const onReset = React.useCallback(() => {
        onToggleMenu();
        setMenu(m => {
            if (!isMenuOpen || m.ids.length === 1) return m;
            return resetMenu(m);
        });
    }, [isMenuOpen, onToggleMenu]);

    React.useEffect(() => {
        setMenu(m => refreshMenu(m, history, navLists));
    }, [history, navLists]);

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

export default connector(NavMenu);