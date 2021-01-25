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

const normaliseBreakpointsArray = (breakpoints: Breakpoints) => {
    return breakpoints.reduce((out: BreakObjectArray, el) => {
        if (isStringOrNumber(el) && !isOfValueNaN(castParseInt(el))) {
            out = [...out, {key: el as BreakIdentifier, value: castParseInt(el)}];
        } else if (!isStringOrNumber(el) && isObjectLiteral(el)) {
            out = [...out, ...parseBreakpointsObject(el as UnknownObject)];
        }

        return out;
    }, []);
};

const createDataMap = (normalisedData: BreakObjectArray) => {
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
)  => {

    return 'hello';
};

export default useBreakpoints;