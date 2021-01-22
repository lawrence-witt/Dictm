import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Album from '@material-ui/icons/Album';
import EventNote from '@material-ui/icons/EventNote';
import Category from '@material-ui/icons/Category';
import { makeStyles } from '@material-ui/core/styles';

type TabTypes = 'recordings' | 'note' | 'categories' | '';

const useNavStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        top: 'auto',
        bottom: 0,
        width: '100%',
        background: theme.palette.primary.main,
        transform: 'translateY(0%)',
        transition: `transform
            ${theme.transitions.duration.standard}ms
            ${theme.transitions.easing.easeInOut}
        `,
        [theme.breakpoints.up('sm')]: {
            transform: 'translateY(100%)'
        }
    }
}));

const useActionStyles = makeStyles(theme => ({
    root: {
        maxWidth: 'unset',
        color: theme.palette.common.white,
        opacity: 0.7,
        '&$selected': {
            opacity: 1,
            color: theme.palette.common.white
        }
    },
    selected: {}
}));

const TabBar: React.FC = () => {
    const navClasses = useNavStyles();
    const actClasses = useActionStyles();

    const [tab, setTab] = React.useState<TabTypes>('');

    // Required to stop mui from throwing TS error
    const changeHandler = (...args: [React.MouseEvent, TabTypes] | unknown[]) => {
        setTab(args[1] as TabTypes);
    };

    return (
            <BottomNavigation
                component="nav"
                value={tab}
                showLabels
                classes={navClasses}
                onChange={changeHandler}
            >
                <BottomNavigationAction
                    label="Recordings"
                    value="recordings"
                    icon={<Album />}
                    classes={actClasses}
                />
                <BottomNavigationAction
                    label="Notes"
                    value="notes"
                    icon={<EventNote />}
                    classes={actClasses}
                />
                <BottomNavigationAction
                    label="Categories"
                    value="categories"
                    icon={<Category />}
                    classes={actClasses}
                />
            </BottomNavigation>
    );
};

export default TabBar;