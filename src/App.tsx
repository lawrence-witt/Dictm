import React from 'react';

function App() {
    const [count, setCount] = React.useState(0);
    const [toggle, setToggle] = React.useState(true);

    React.useEffect(() => {
        setCount(count + 1);
    }, [toggle]);

    return (
        <>
            <h1>Hello World! Again</h1>
            <button onClick={() => setToggle(!toggle)}>Toggle</button>
        </>
    );
};

export default App;