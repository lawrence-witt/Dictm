import React from 'react';

// Input Types

type BreakIdentifier = string | number;

type BreakpointSchema = Record<BreakIdentifier, number>;

type BreakpointsArray = (BreakIdentifier | BreakpointSchema)[]

type Breakpoints = BreakpointSchema | BreakpointsArray;

type FloorType = BreakIdentifier | boolean;

// Internal Types

type BreakObject = {
    key: string | number;
    value: number;
}

type BreakIdentifierArray = BreakIdentifier[];

type BreakObjectArray = BreakObject[];

type UnknownObject = Record<string, unknown>;

interface NormalisedValues {
    keys: BreakIdentifierArray;
    entries: BreakpointSchema;
}

// Output Type

interface BreakpointData extends NormalisedValues {
    value: BreakIdentifier;
    index: number;
}

// Helpers

const castParseInt = (val: unknown) => parseInt(`${val}`);
const isStringOrNumber = (test: unknown) => typeof test === 'number' || typeof test === 'string';
const isObjectLiteral = (test: unknown) => test && Object.getPrototypeOf(test) === Object.prototype;
const isOfValueNaN = (test: unknown) => test !== test;

const sortBreakObjectArray = (arr: BreakObjectArray) => [...arr].sort((a, b) => a.value - b.value);

const parseBreakpointsObject = (obj: UnknownObject) => {
    return Object.keys(obj).reduce((out: BreakObjectArray, key) => {
        if (!isOfValueNaN(castParseInt(obj[key]))) {
            out = [...out, {key, value: castParseInt(obj[key])}];
        }
        return out;
    }, []);
};

const normaliseBreakpoints = (breakpoints: Breakpoints) => {
    let breakObjectArray: BreakObjectArray;

    if (isObjectLiteral(breakpoints)) {
        breakObjectArray = parseBreakpointsObject(breakpoints as UnknownObject);
    }
    
    breakObjectArray = (breakpoints as []).reduce((out: BreakObjectArray, el) => {
        if (!isOfValueNaN(castParseInt(el))) {
            out = [...out, {key: el as BreakIdentifier, value: castParseInt(el)}];
        } else if (isObjectLiteral(el)) {
            out = [...out, ...parseBreakpointsObject(el as UnknownObject)];
        }
        return out;
    }, []);

    return sortBreakObjectArray(breakObjectArray);
};

const createDataMap = (normalisedData: BreakObjectArray) => {
    return normalisedData.reduce((out: NormalisedValues, bo) => {
        return {
            keys: [...out.keys, bo.key], 
            entries: {...out.entries, [bo.key]: bo.value}
        };
    }, {keys: [], entries: {}});
};

const addFloors = (
    widthMap: NormalisedValues,
    heightMap: NormalisedValues,
    val: FloorType
): void => {
    const floorKey = 
        typeof val === 'string' || 
        (typeof val === 'number' && !isOfValueNaN(val)) ?
        val : '_';

    [widthMap, heightMap].forEach(map => {
        if (map.entries[map.keys[0]] !== 0) {
            map.keys.unshift(floorKey);
            map.entries[floorKey] = 0;
        }
    });
};

// Base Hook

const useBreakpoints = (
    widthPoints: Breakpoints, 
    heightPoints: Breakpoints,
    createFloor: FloorType = true
)  => {

    const normalisedBreakpoints = React.useMemo(() => {
        const widthMap = createDataMap(normaliseBreakpoints(widthPoints || []));
        const heightMap = createDataMap(normaliseBreakpoints(heightPoints || []));

        createFloor && addFloors(widthMap, heightMap, createFloor);

        return { widthMap, heightMap };
    }, [widthPoints, heightPoints, createFloor]);

    return 'hello';
};

export default useBreakpoints;