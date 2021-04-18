import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { navigationOperations } from '../../../redux/ducks/navigation';

import { makeStyles } from '@material-ui/core/styles';

import DashboardSwitch from './switch/DashboardSwitch';

import ToolBar from '../../sections/ToolBar/ToolBar';
import NavBar from '../../sections/NavBar/NavBar';
import NavMenu from '../../sections/NavMenu/NavMenu';
import Editor from '../../sections/Editor/Editor';

/* 
*   Redux
*/

const mapDispatch = {
    changeLocation: navigationOperations.changeLocation
}

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const useStyles = makeStyles(() => ({
    fixedBase: {
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'fixed'
    },
    pageBase: {
        height: '100%',
        width: '100%',
        minWidth: 300,
        display: 'flex',
        flexDirection: 'column'
    },
    contentBase: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    templateFrame: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
}));

const Dashboard: React.FC<ReduxProps> = (props) => {
    const {
        changeLocation
    } = props;

    const classes = useStyles();

    const history = useHistory();

    React.useLayoutEffect(() => {
        const unlisten = history.listen((location) => {
            changeLocation(location);
        });

        changeLocation(history.location);

        return () => unlisten();
    }, [history, changeLocation]);

    return (
        <div className={classes.fixedBase}>
            <NavMenu/>
            <div className={classes.pageBase}>
                <ToolBar/>
                <DashboardSwitch />
                <Editor />
                <NavBar />
            </div>
        </div>
    )
};

export default connector(Dashboard);