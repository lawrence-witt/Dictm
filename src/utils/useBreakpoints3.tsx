import React from 'react';

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

interface NormalisedValues {
    keys: BreakIdentifier[];
    entries: BreakpointSchema;
}

// Output Type

interface BreakpointData extends NormalisedValues {
    value: BreakIdentifier;
    index: number;
}

// Type Helpers

const castParseInt = (val: unknown) => parseInt(`${val}`);
const isObjectLiteral = (test: unknown) => test && Object.getPrototypeOf(test) === Object.prototype;
const isOfValueNaN = (test: unknown) => test !== test;

// Normalising Functions

const parseBreakpointsObject = (obj: UnknownObject) => {
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
        breakpointEntries = parseBreakpointsObject(breakpoints as UnknownObject);
    } else if (Array.isArray(breakpoints)) {
        breakpointEntries = breakpoints.reduce((out: BreakpointEntries, el) => {
            if (!isOfValueNaN(castParseInt(el))) {
                out = [...out, [el as BreakIdentifier, castParseInt(el)]];
            } else if (isObjectLiteral(el)) {
                out = [...out, ...parseBreakpointsObject(el as UnknownObject)];
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
    const floorKey = 
        typeof val === 'string' || 
        (typeof val === 'number' && !isOfValueNaN(val)) ?
        val : '_';

    [widthEntries, heightEntries].forEach(list => {
        if (!list[0] || list[0][1] !== 0) {
            list.unshift([floorKey, 0]);
        }
    });
};

const constructReturnObject = (
    entries: BreakpointEntry[], 
    index: number
) => ({
    id: entries[index][0],
    index,
    keys: entries.map(e => e[0]),
    map: entries.reduce((o: BreakpointSchema, e) => {o[e[0]] = e[1]; return o;}, {})
});

// Query Constructors

const belowMedia = (val: number) => `(max-width: ${val})`;
const betweenMedia = (min: number, max: number) => `(min-width: ${min}) and (max-width: ${max})`;
const aboveMedia = (val: number) => `(min-width: ${val})`;

// Query Functions

const getInitialBreakpointIndex = (
    widthValues: number[],
    heightValues: number[]
) => {
    const getIndex = (arr: number[]) => (
        arr.findIndex((v, i) => (
            window.matchMedia(
                betweenMedia(v, arr[i+1] || window.innerWidth)
            ).matches
        ))
    );

    return [ getIndex(widthValues), getIndex(heightValues) ];
};

// Base Hook

const useBreakpoints = (
    widthPoints: Breakpoints, 
    heightPoints: Breakpoints,
    createFloor: FloorType = true
)  => {

    const normalisedBreakpoints = React.useMemo(() => {
        const widthEntries = normaliseBreakpoints(widthPoints || []);
        const heightEntries = normaliseBreakpoints(heightPoints || []);

        createFloor && addFloors(widthEntries, heightEntries, createFloor);

        const [
            widthIdx,
            heightIdx
        ] = getInitialBreakpointIndex(
            widthEntries.map(e => e[1]), 
            heightEntries.map(e => e[1])
        );

        return { widthEntries, heightEntries, widthIdx, heightIdx };
    }, [widthPoints, heightPoints, createFloor]);

    const [widthObject, setWidthObject] = React.useState(() => {
        const { widthEntries, widthIdx } = normalisedBreakpoints;
        return constructReturnObject(widthEntries, widthIdx);
    });

    const [heightObject, setHeightObject] = React.useState(() => {
        const { heightEntries, heightIdx } = normalisedBreakpoints;
        return constructReturnObject(heightEntries, heightIdx);
    });

    return 'hello';
};

export default useBreakpoints;