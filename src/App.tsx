import React from 'react';
import { hot } from 'react-hot-loader';

const App: React.FC = (): React.ReactElement => {
    const [count, setCount] = React.useState(0);
    const [toggle, setToggle] = React.useState(true);

    React.useEffect(() => {
        setCount(c => c + 1);
    }, [toggle]);

    return (
        <>
            <h1>Hello World! Again!!</h1>
            <button onClick={() => setToggle(!toggle)}>Toggle</button>
        </>
    );
}

export default hot(module)(App);