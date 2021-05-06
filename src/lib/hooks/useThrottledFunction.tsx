import React from 'react';

import useAsRef from './useAsRef';

const useThrottledFunction = <
    Args extends unknown[], 
    R
>(
    fn: (...args: Args) => R, 
    ms: number
): (...args: Args) => R => {
    const lastCall = React.useRef<number | undefined>();
    const lastResult = React.useRef() as React.MutableRefObject<R>;

    const fnRef = useAsRef(fn);
    const msRef = useAsRef(ms);

    const callback = React.useCallback((...args: Args) => {
        const stamp = performance.now();

        if (!lastCall.current || stamp - lastCall.current > msRef.current) {
            lastCall.current = stamp;
            lastResult.current = fnRef.current(...args);
        }

        return lastResult.current;
    }, [fnRef, msRef]);

    return callback;
}

export default useThrottledFunction;