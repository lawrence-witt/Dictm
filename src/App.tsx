import React, { useState } from 'react';
import { hot } from 'react-hot-loader';

const App: React.FC = (): React.ReactElement => {
    const [bool] = useState(true);

    return <h1>App</h1>;
};

export default hot(module)(App);