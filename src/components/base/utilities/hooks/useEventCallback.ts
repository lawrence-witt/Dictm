import * as React from 'react';

// Fn stored in ref to prevent it being recreated too often

function useEventCallback<T>(
    fn?: (args: T) => void
): (args: T) => void {
    const ref = React.useRef(fn);

    React.useLayoutEffect(() => {
        ref.current = fn;
    });

    return React.useCallback((...args) => ref.current(...args), []);
}

export default useEventCallback;