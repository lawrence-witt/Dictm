import React from 'react';
import { hot } from 'react-hot-loader';
import { connect, ConnectedProps } from 'react-redux';

import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import { RootState } from '../redux/store';
import { historyOperations } from '../redux/ducks/history';
import { authOperations } from '../redux/ducks/auth';

import OnMount from '../components/atoms/OnMount/OnMount';
import Notifier from '../components/organisms/Notifier/Notifier';
import Splash from '../components/views/Splash/Splash';
import Auth from '../components/views/Auth/Auth';
import Dashboard from '../components/views/Dashboard/Dashboard';

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

    // Control shared route

    const [privateContext, setPrivateContext] = React.useState(userLoaded);
    const [redirect, setRedirect] = React.useState<JSX.Element | undefined>(undefined);

    React.useEffect(() => {
        if (userLoaded === privateContext) return;

        if (!userLoaded && privateContext) {
            setRedirect(<Redirect to="/auth" />);
        }

        setPrivateContext(userLoaded);
    }, [userLoaded, privateContext]);

    // Initialise the application on page load

    React.useEffect(() => { initialiseApp() }, [initialiseApp]);
    
    if (!appInitialised) return null;

    return (
        <>
            <Notifier/>
                <Switch>
                    <Route path="/" exact={!privateContext}>
                        {redirect && (
                            <OnMount onMount={() => setRedirect(undefined)}>
                                {redirect}
                            </OnMount>
                        )}
                        {privateContext ? <Dashboard /> : <Splash />}
                    </Route>
                    <Route path="/auth" component={Auth}/>
                    <Redirect to="/"/>
                </Switch>
        </>
    );
}

export default hot(module)(connector(Root));