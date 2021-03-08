import React from 'react';

const useToggle = (initial = true): [ boolean, () => void ] => {
    const [state, set] = React.useState(initial);

    const toggle = React.useCallback(() => set(s => !s), []);

    return [ state, toggle ];
};

export default useToggle;