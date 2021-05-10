import React from 'react';

import * as types from './OnMount.types';

const OnMount: React.FC<types.OnMountProps> = ({onMount, children}) => {
    const mounted = React.useRef(false);

    React.useEffect(() => { 
        if (!mounted.current) {
            onMount();
            mounted.current = true;
        } 
    }, [onMount]);

    return <>{children}</>;
}

export default OnMount;