import React from 'react';
import { useTransition, animated } from 'react-spring';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';

import HybridDrawer from '../../Drawers/HybridDrawer';

import demoDirectory from './demoDirectory';
import NavMenuHeader from './NavMenuHeader';
import NavMenuItem from './NavMenuItem';

import { useBreakContext } from '../../../utils/hooks/useBreakpoints';

// Types

interface NavMenuProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
}

// Styles

const useNavMenuStyles = makeStyles(() => ({
    listContainer: {
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

    const classes = useNavMenuStyles();

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
        /* setAppDirectory(ad => {
            // issue here is newList.subItmes possibly undefined
            const newList = ad.current.find(item => item.primary === primary);
            if (!newList) return ad;

            return {
                depth: ad.depth + 1,
                path: [...ad.path, primary],
                root: ad.root,
                current: newList.subItems
            }
        }); */
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

    const transition = useTransition([current], {
        initial: {transform: 'translateX(0%)'},
        from: { transform: 'translateX(100%)'},
        enter: { transform: 'translateX(0%)'},
        leave: { transform: 'translateX(-100%)'}
    });

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
            <div className={classes.listContainer}>
                {transition((style, items) => items && (
                    <AnimatedList style={style} disablePadding className={classes.list}>
                        {items.map((item, i) => (
                            <NavMenuItem 
                                key={`${i}${item.primary}`}
                                increaseDepth={increaseDepth}
                                {...item} 
                            />
                        ))}
                    </AnimatedList>
                ))}
            </div>
        </HybridDrawer>
    );
};

export default NavMenu;