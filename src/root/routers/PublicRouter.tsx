import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Splash from '../../components/views/Splash/Splash';
import Auth from '../../components/views/Auth/Auth';

const PublicRouter: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/" component={Splash} />
            <Route path="/auth" component={Auth} />
            <Redirect to="/" />
        </Switch>
    )
}

export default PublicRouter;