/* import React from 'react';

// Input Types

type BreakIdentifier = string | number;

type BreakpointSchema = Record<BreakIdentifier, number>;

type BreakpointsArray = (BreakIdentifier | BreakpointSchema)[]

type Breakpoints = BreakpointSchema | BreakpointsArray;

type FloorType = BreakIdentifier | boolean;

// Internal Types

type BreakpointEntry = [BreakIdentifier, number];

type BreakpointEntries = BreakpointEntry[];

type UnknownObject = Record<string, unknown>;

type Dim = 'width' | 'height';

// Output Types

interface BreakpointData {
    id: BreakIdentifier;
    index: number;
    keys: BreakIdentifier[];
    map: BreakpointSchema;
}

interface ReturnType {
    widthBreaks: BreakpointData;
    heightBreaks: BreakpointData;
}

// Type Helpers

const castParseInt = (val: unknown) => parseInt(`${val}`);
const isObjectLiteral = (test: unknown) => test && Object.getPrototypeOf(test) === Object.prototype;
const isOfValueNaN = (test: unknown) => test !== test;

// Normalising Functions

const getIntegerEntries = (obj: UnknownObject) => {
    return Object.keys(obj).reduce((out: BreakpointEntries, key) => {
        if (!isOfValueNaN(castParseInt(obj[key]))) {
            out = [...out, [key, castParseInt(obj[key])]];
        }
        return out;
    }, []);
};

const normaliseBreakpoints = (breakpoints: Breakpoints) => {
    let breakpointEntries: BreakpointEntries = [];

    if (isObjectLiteral(breakpoints)) {
        breakpointEntries = getIntegerEntries(breakpoints as UnknownObject);
    } else if (Array.isArray(breakpoints)) {
        breakpointEntries = breakpoints.reduce((out: BreakpointEntries, el) => {
            if (!isOfValueNaN(castParseInt(el))) {
                out = [...out, [el as BreakIdentifier, castParseInt(el)]];
            } else if (isObjectLiteral(el)) {
                out = [...out, ...getIntegerEntries(el as UnknownObject)];
            }
            return out;
        }, []);
    }

    return breakpointEntries.sort((a, b) => a[1] - b[1]);
};

const addFloors = (
    widthEntries: BreakpointEntries,
    heightEntries: BreakpointEntries,
    val: FloorType
): void => {
    const floorKey = (() => {
        if (typeof val === 'string') return val;
        if (typeof val === 'number' && !isOfValueNaN(val)) return val;
        return '_';
    })();

    [widthEntries, heightEntries].forEach(list => {
        if (!list[0] || list[0][1] !== 0) {
            list.unshift([floorKey, 0]);
        }
    });
};

const getBreakpointData = (
    entries: BreakpointEntry[], 
    index: number
) => ({
    id: (entries[index] && entries[index][0]) || null,
    index,
    keys: entries.map(e => e[0]),
    map: entries.reduce((o: BreakpointSchema, e) => {o[e[0]] = e[1]; return o;}, {})
});

// Query Constructors

const belowMedia = (val: number) => `(max-width: ${val}px)`;
const betweenMedia = (min: number, max: number) => `(min-width: ${min}px) and (max-width: ${max}px)`;
const aboveMedia = (val: number) => `(min-width: ${val}px)`;

// Query Functions

const getDocumentDim = (dim: Dim) => {
    const inner = dim === 'width' ? 'innerWidth' : 'innerHeight';
    const client = dim === 'height' ? 'clientWidth' : 'clientHeight';

    return window[inner] || 
    document.documentElement[client] || 
    document.body[client];
};

const getInitialBreakpointIndex = (
    widthValues: number[],
    heightValues: number[]
) => {
    const getIndex = (arr: number[], dim: number) => (
        arr.findIndex((v, i) => (
            window.matchMedia(
                betweenMedia(v, arr[i+1] || dim)
            ).matches
        ))
    );

    return [ 
        getIndex(widthValues, getDocumentDim('width')), 
        getIndex(heightValues, getDocumentDim('height')) 
    ];
};

const watchEntries = (
    entries: BreakpointEntries,
    cb: (index: number) => void
) => {
    const onChange = (i: number) => (event: MediaQueryListEvent) => {
        cb(event.matches ? i : i - 1);
    }

    const watchList = entries.reduce((list, entry, i) => {
        const query = window.matchMedia(aboveMedia(entry[1]));
        const handler = onChange(i);
        query.addEventListener('change', handler);
        return [...list, [query, handler]];
    }, []);

    return {
        cancel: () => watchList.forEach((query) => {
            query[0].removeEventListener('change', query[1]);
        })
    }
}

// Base Hook

const useBreakpoints = (
    widthPoints: Breakpoints, 
    heightPoints: Breakpoints,
    createFloor: FloorType = true
): ReturnType  => {

    const normalisedBreakpoints = React.useMemo(() => {
        const widthEntries = normaliseBreakpoints(widthPoints || []);
        const heightEntries = normaliseBreakpoints(heightPoints || []);

        if (createFloor) addFloors(widthEntries, heightEntries, createFloor);

        const [ widthIdx, heightIdx] = getInitialBreakpointIndex(
            widthEntries.map(e => e[1]), 
            heightEntries.map(e => e[1])
        );

        return { widthEntries, heightEntries, widthIdx, heightIdx };
    }, [widthPoints, heightPoints, createFloor]);

    const [widthBreaks, setWidthBreaks] = React.useState(() => {
        const { widthEntries, widthIdx } = normalisedBreakpoints;
        return getBreakpointData(widthEntries, widthIdx);
    });

    const [heightBreaks, setHeightBreaks] = React.useState(() => {
        const { heightEntries, heightIdx } = normalisedBreakpoints;
        return getBreakpointData(heightEntries, heightIdx);
    });

    const isMounted = React.useRef(false);

    React.useEffect(() => {
        const { widthEntries, heightEntries, widthIdx, heightIdx } = normalisedBreakpoints;

        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            setWidthBreaks(getBreakpointData(widthEntries, widthIdx));
            setHeightBreaks(getBreakpointData(heightEntries, heightIdx));
        }

        const widthWatch = watchEntries(widthEntries, index => {
            setWidthBreaks(wb => ({...wb, id: wb.keys[index], index}));
        });
        const heightWatch = watchEntries(heightEntries, index => {
            setHeightBreaks(hb => ({...hb, id: hb.keys[index], index}));
        });

        return () => {
            widthWatch.cancel();
            heightWatch.cancel();
        }
    }, [normalisedBreakpoints]);

    return {
        widthBreaks,
        heightBreaks
    }
};

export default useBreakpoints; */