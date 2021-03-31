import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { navigationSelectors } from '../../../redux/ducks/navigation';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Album from '@material-ui/icons/Album';
import EventNote from '@material-ui/icons/EventNote';
import Category from '@material-ui/icons/Category';
import { makeStyles, fade } from '@material-ui/core/styles';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    tab: navigationSelectors.getNavBarTab(state.navigation.history.current.params)
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useNavStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: '0 0 auto',
        width: '100%',
        background: theme.palette.primary.main,
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        }
    }
}));

const useActionStyles = makeStyles(theme => ({
    root: {
        maxWidth: 'unset',
        color: fade(theme.palette.common.white, 0.7),
        '&$selected': {
            opacity: 1,
            color: theme.palette.common.white
        }
    },
    selected: {}
}));

const NavBar: React.FC<ReduxProps> = (props) => {
    const {
        tab
    } = props;

    const navClasses = useNavStyles();
    const actionClasses = useActionStyles();

    const history = useHistory();

    return (
            <BottomNavigation
                component="nav"
                value={tab}
                showLabels
                classes={navClasses}
            >
                <BottomNavigationAction
                    label="Recordings"
                    value="recordings"
                    icon={<Album />}
                    classes={actionClasses}
                    onClick={() => history.push('/recordings')}
                />
                <BottomNavigationAction
                    label="Notes"
                    value="notes"
                    icon={<EventNote />}
                    classes={actionClasses}
                    onClick={() => history.push('/notes')}
                />
                <BottomNavigationAction
                    label="Categories"
                    value="categories"
                    icon={<Category />}
                    classes={actionClasses}
                    onClick={() => history.push('/categories')}
                />
            </BottomNavigation>
    );
};

export default connector(NavBar);