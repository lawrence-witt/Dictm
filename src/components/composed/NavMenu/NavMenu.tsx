import React from 'react';
import List from '@material-ui/core/List';

import HybridDrawer from '../../generic/HybridDrawer';
import NavMenuHeader from './NavMenuHeader';
import NavMenuItem from './NavMenuItem';

import { useBreakContext } from '../../../utils/hooks/useBreakpoints';

// Types

type IconTypes = 'album' | 'note' | 'category' | 'settings' | 'signout';

interface NavMenuProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
}

interface MenuItem {
    primary: string,
    secondary?: string,
    type: 'link' | 'action',
    value: string,
    icon?: IconTypes,
    divider?: boolean,
    subItems?: MenuItem[]
}

// List Structure

const demoDirectory: MenuItem[] = [
    {
        primary: 'Recordings', 
        secondary: '',
        type: 'link',  
        value: '/', 
        icon: 'album'
    },
    {
        primary: 'Notes',
        secondary: '',
        type: 'link',
        value: '/notes',
        icon: 'note'
    },
    {
        primary: 'Categories',
        secondary: '',
        type: 'link',
        value: '/categories',
        icon: 'category',
        subItems: [
            {
                primary: 'CategoryOne',
                secondary: '',
                type: 'link',
                value: '/categories/categoryOne'
            }
        ]
    },
    {
        primary: 'Settings',
        secondary: '',
        type: 'link',
        value: '/settings',
        icon: 'settings',
        divider: true
    },
    {
        primary: 'Sign Out',
        secondary: '',
        type: 'action',
        value: 'sign-out',
        icon: 'signout'
    }
];

// Component

const NavMenu: React.FC<NavMenuProps> = ({
    isMenuOpen, toggleMenu
}) => {

    const [appDirectory, setAppDirectory] = React.useState({
        depth: isMenuOpen ? 1 : 0,
        path: ['Lazarus'],
        root: demoDirectory,
        current: demoDirectory
    });

    const { depth, path, current } = appDirectory;

    const breakpoint = useBreakContext();

    React.useEffect(() => {
        const newDepth = (isMenuOpen || breakpoint.index === 2) ? 1 : 0;

        setAppDirectory(ad => {
            if (newDepth === ad.depth) return ad;

            return {
                ...ad,
                depth: newDepth,
                path: ['Lazarus'],
                current: ad.root
            }
        })
    }, [isMenuOpen, breakpoint.index]);

    const increaseDepth = React.useCallback((primary: string) => {
        setAppDirectory(ad => {
            const newList = ad.current.find(item => item.primary === primary);
            if (!newList) return ad;

            return {
                depth: ad.depth + 1,
                path: [...ad.path, primary],
                root: ad.root,
                current: newList.subItems
            }
        });
    }, []);

    const reduceDepth = React.useCallback(() => {
        setAppDirectory(ad => {
            if (ad.depth === 1) return ad;

            return {
                ...ad,
                depth: ad.depth - 1,
                path: ['Lazarus'],
                current: ad.root
            }
        })
    }, []);

    return (
        <HybridDrawer 
            flow={breakpoint.index} 
            open={depth > 0}
            onClose={toggleMenu}
        >
            <NavMenuHeader
                flow={breakpoint.index}
                open={depth > 0}
                depth={depth}
                title={path[path.length-1]}
                toggleMenu={toggleMenu}
                reduceDepth={reduceDepth}
            />
            <List disablePadding>
                {current.map((item, i) => (
                    <NavMenuItem 
                        key={`${i}${item.primary}`}
                        increaseDepth={increaseDepth}
                        {...item} 
                    />
                ))}
            </List>
        </HybridDrawer>
    );
};

export default NavMenu;