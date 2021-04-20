/* this hook is a workaround for the deprecation of the `unique` prop in react-spring v9 */

import React from 'react';

import { useTransition, UseTransitionProps, TransitionFn } from 'react-spring';

function useUniqueTransition<
    I extends {[key: string]: any}, 
    K extends keyof I
>(
    key: K,
    item: I,
    transitionProps: UseTransitionProps
): TransitionFn {
    const [store, setStore] = React.useState(item);

    React.useEffect(() => {
        if (item[key] !== store[key]) {
            setStore(item);
        }
    }, [key, item, store]);

    return useTransition(store, transitionProps);
}

export default useUniqueTransition;