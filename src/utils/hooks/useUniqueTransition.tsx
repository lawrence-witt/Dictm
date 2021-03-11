/* this hook is a workaround for the deprecation of the `unique` prop in react-spring v9 */

import React from 'react';

import { useTransition, UseTransitionProps, TransitionFn } from 'react-spring';

function useUniqueTransition<K extends string>(
    key: K,
    item: Record<string, any>,
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