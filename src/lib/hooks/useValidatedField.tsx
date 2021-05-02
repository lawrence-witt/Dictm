import React from 'react';

import useAsRef from './useAsRef';

interface ValidationFunction<V> {
    (value: V): boolean | undefined | void;
}

interface ValueFunction<V> {
    (value: V): void;
}

type UseValidatedFieldReturn<V> = [V, ValueFunction<V>, string | boolean];

const isInvalid = <V extends unknown>(value: V, tests: ValidationFunction<V>[]) => {
    for (const test of tests) {
        try {
            return !Boolean(test(value));
        } catch (thrown) {
            if (thrown instanceof Error) return thrown.message;
            if (typeof thrown === "string") return thrown;
            return true;
        }
    }

    return false;
}

const useValidatedField = <I extends unknown>(
    initialValue: I,
    tests?: ValidationFunction<I> | Array<ValidationFunction<I>>,
    onValidated?: ValueFunction<I>,
    debounce?: number
): UseValidatedFieldReturn<I> => {
    const testsArray = React.useMemo(() => {
        return !tests ? [] : Array.isArray(tests) ? tests : [tests];
    }, [tests]);

    const [state, setState] = React.useState(() => ({
        value: initialValue,
        error: isInvalid(initialValue, testsArray)
    }));

    const timeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const testsRef = useAsRef(testsArray);
    const onValidatedRef = useAsRef(onValidated);
    const debounceRef = useAsRef(debounce);

    const changeValue = React.useCallback(<V extends I>(value: V) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = undefined;
        }

        const runTests = (value: V) => isInvalid(value, testsRef.current);
        const commitIfValidated = (error: string | boolean) => {
            if (onValidatedRef.current && !error) onValidatedRef.current(value);
        }

        if (!debounceRef.current) {
            const error = runTests(value);
            setState({value, error});
            commitIfValidated(error);
            return;
        }

        setState(s => ({...s, value}));

        timeout.current = setTimeout(() => {
            const error = runTests(value);
            setState(s => s.error === error ? s : {...s, error});
            commitIfValidated(error);
        }, debounceRef.current);
    }, [testsRef, onValidatedRef, debounceRef]);

    return [state.value, changeValue, state.error];
}

export default useValidatedField;