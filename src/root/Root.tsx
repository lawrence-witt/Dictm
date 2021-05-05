import React from 'react';
import { hot } from 'react-hot-loader';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { RootState } from '../redux/store';
import { historyOperations } from '../redux/ducks/history';
import { authOperations } from '../redux/ducks/auth';

import PublicRouter from './routers/PublicRouter';
import PrivateRouter from './routers/PrivateRouter';

import Notifier from '../components/organisms/Notifier/Notifier';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    appInitialised: state.auth.app.isInitialised,
    userLoaded: Boolean(state.user.profile && state.user.session)
});

const mapDispatch = {
    changeLocation: historyOperations.changeLocation,
    initialiseApp: authOperations.initialiseApp
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const Root: React.FC<ReduxProps> = (props) => {
    const {
        changeLocation,
        initialiseApp,
        appInitialised,
        userLoaded
    } = props;

    // Persist route changes to state for derived data

    const history = useHistory();

    React.useEffect(() => {
        const unlisten = history.listen((location) => {
            changeLocation(location);
        });

        changeLocation(history.location);

        return () => unlisten();
    }, [history, changeLocation]);

    // Initialise the application on page load

    React.useEffect(() => {
        initialiseApp()
    }, [initialiseApp]);
    
    if (!appInitialised) return null;

    // Choose which routes to activate

    return (
        <>
            <Notifier/>
            {userLoaded ? <PrivateRouter/> : <PublicRouter />}
        </>
    );
}

export default hot(module)(connector(Root));