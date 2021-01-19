import * as React from 'react';
import {
    BottomNavigation,
    BottomNavigationAction
} from '@material-ui/core'
import {
    Album,
    EventNote,
    Category
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles';

const useNavStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        top: 'auto',
        bottom: 0,
        width: '100%',
        background: theme.palette.primary.main
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

    const [section, setSection] = React.useState('recordings');

    return (
            <BottomNavigation
                value={section}
                onChange={(ev, val) => setSection(val)}
                showLabels
                classes={navClasses}
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