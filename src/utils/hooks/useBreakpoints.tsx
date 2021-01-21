import React from 'react';

// Input Types

type BreakIdentifier = string | number;

type BreakpointSchema = Record<BreakIdentifier, number>;

type Breakpoints = (BreakIdentifier | BreakpointSchema)[];

// Internal Types

type BreakObject = {
    key: string | number;
    value: number;
}

type BreakKeys = BreakIdentifier[];

interface NormalisedValues {
    keys: BreakKeys;
    entries: BreakpointSchema;
}

// Output Type

interface BreakpointData extends NormalisedValues {
    value: BreakIdentifier;
    index: number;
}

// Helpers

const isObjectLiteral = (test: unknown) => test && Object.getPrototypeOf(test) === Object.prototype;

const isOfValueNaN = (test: unknown) => test !== test;

const createBreakObject = (key: BreakIdentifier, value: number): BreakObject => ({key, value});

const extractBreakpoints = (obj: {[key: string]: unknown}): BreakObject[] => {
    return Object.keys(obj).reduce((out, key) => {
        if (!isOfValueNaN(parseInt(`${obj[key]}`))) {
            out = [...out, createBreakObject(key, parseInt(`${obj[key]}`))];
        }
        return out;
    }, []);
};

const extractAndSortArray = (breakpoints: Breakpoints) => {
    return breakpoints.reduce((out: BreakObject[], bp) => {
        if (
            (typeof bp === 'number' || typeof bp === 'string') && 
            !isOfValueNaN(parseInt(`${bp}`))
        ) {
            out = [...out, createBreakObject(bp, parseInt(`${bp}`))];
        } else if (
            typeof bp !== 'number' && typeof bp !== 'string' &&
            isObjectLiteral(bp)
        ) {
            out = [...out, ...extractBreakpoints(bp)];
        }

        return out;
    }, []).sort((a, b) => a.value - b.value);
};

const createDataMap = (normalisedData: BreakObject[]) => {
    return normalisedData.reduce((out: NormalisedValues, bo) => {
        out.keys.push(bo.key);
        out.entries[bo.key] = bo.value;

        return out;
    }, {keys: [], entries: {}});
};

// Base Hook

const useBreakpoints = (
    breakpoints: Breakpoints, 
    createFloor?: boolean
): BreakpointData  => {

    /* 
    |   Summary: Normalise input array of Breakpoints.
    |
    |   Description:
    |   Convert all possible Breakpoint formats into a key/value pair.
    |   Sort these key/value pairs in ascending order by value.
    |   Map the sorted pairs to an object including the keys and entries.
    |
    |   @return: normalisedValues {Object} See NormalisedValues internal type.
    */

    const normalisedBreakpointParams = React.useMemo(() => {
        /* console.log('normalising'); */
        const normalisedData = extractAndSortArray(breakpoints);
        const dataMap = createDataMap(normalisedData);

        if (createFloor && dataMap.entries[dataMap.keys[0]] !== 0) {
            dataMap.keys.unshift("_");
            dataMap.entries["_"] = 0;
        }

        return dataMap;
    }, [breakpoints, createFloor]);

    /* 
    |   Summary: Calculate the current breakpoint based on device width.
    |
    |   Description:
    |   Use the sorted array of keys to compare values on the entries object.
    |   Array.findIndex is used to test the range between current and next value.
    |
    |   @return breakpointData {Object} See BreakpointData type.
    */

    const getBreakpointData = React.useCallback((): BreakpointData => {
        const { keys, entries } = normalisedBreakpointParams;

        const w = 
            window.innerWidth || 
            document.documentElement.clientWidth || 
            document.body.clientWidth;
        
        const index = keys.findIndex((key, i, arr) => {
            const val = entries[key];
            const next = entries[arr[i + 1]];
            return w >= val && w < (next || w + 1);
        });

        return {
            value: keys[index],
            index,
            keys,
            entries
        };
    }, [normalisedBreakpointParams]);

    /* 
    |   Summary: Reactive state hook.
    */

    const [data, setData] = React.useState<BreakpointData>(getBreakpointData);

    /* 
    |   Summary: Add resize event listener.
    */

    React.useEffect(() => {
        const checkBreakpoints = () => {
            const result = getBreakpointData();
            setData(d => {
                return d.value === result.value &&
                d.entries[d.value] === result.entries[result.value] ?
                d : result;
            });
        };

        window.addEventListener('resize', checkBreakpoints);
        checkBreakpoints();

        return () => window.removeEventListener('resize', checkBreakpoints);
    }, [getBreakpointData]);

    return data;
};

// Encapsulate hook with context

const BreakContext = React.createContext(null);

const BreakContextProvider: React.FC<{
    breakpoints: Breakpoints, createFloor?: boolean
}> = ({
    breakpoints, createFloor, children
}) => {
    const breakpoint = useBreakpoints(breakpoints, createFloor);

    return (
        <BreakContext.Provider value={breakpoint}>
            {children}
        </BreakContext.Provider>
    )
}

const useBreakContext = (): BreakpointData => {
    return React.useContext(BreakContext);
};

// Exports

export { 
    Breakpoints, 
    BreakContextProvider, 
    useBreakContext 
};

export default useBreakpoints;