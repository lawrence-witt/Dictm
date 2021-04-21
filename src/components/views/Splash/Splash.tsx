import React from 'react';

import { useHistory } from 'react-router-dom';

const Splash: React.FC = () => {
    const history = useHistory();

    return (
        <>
            Splash View
            <button onClick={() => history.push('/auth')}>Go to Auth</button>
        </>
    )
}

export default Splash;