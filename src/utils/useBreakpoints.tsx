import React from 'react';

// Input Types

type BreakIdentifier = string | number;

type BreakpointSchema = Record<BreakIdentifier, number>;

type BreakpointsArray = (BreakIdentifier | BreakpointSchema)[];

type Breakpoints =  BreakpointsArray | BreakpointSchema | undefined;

type FloorType = string | number | boolean;

interface IBreakpointProvider {
    widthpoints?: Breakpoints;
    heightpoints?: Breakpoints;
    createFloor?: FloorType;
}

// Internal Types

type BreakPair = [string | number, number];

type UnknownObject = Record<string, unknown>;

type BreakPairArray = BreakPair[];

type BreakKeys = BreakIdentifier[];

type MappedValues = {
    keys: BreakKeys;
    entries: BreakpointSchema;
}

enum Dim {
    WIDTH,
    HEIGHT
}

// Output Type

interface BreakpointData extends MappedValues {
    value: BreakIdentifier;
    index: number;
}

interface BreakpointReturns {
    widthPoint: BreakpointData;
    heightPoint: BreakpointData;
}

// Helpers

const isObjectLiteral = (test: unknown) => test && Object.getPrototypeOf(test) === Object.prototype;
const isOfValueNaN = (test: unknown) => test !== test;
const sortBreakPairArray = (arr: BreakPair[]) => [...arr].sort((a, b) => a[1] - b[1]);

const getDocumentDim = (dim: Dim) => {
    const inner = dim === Dim.WIDTH ? 'innerWidth' : 'innerHeight';
    const client = dim === Dim.WIDTH ? 'clientWidth' : 'clientHeight';

    return window[inner] || 
    document.documentElement[client] || 
    document.body[client];
};

const parseBreakpointsObject = (obj: UnknownObject): BreakPairArray => {
    return Object.keys(obj).reduce((out, key) => {
        if (!isOfValueNaN(parseInt(`${obj[key]}`))) {
            out = [...out, [key, parseInt(`${obj[key]}`)]];
        }
        return out;
    }, []);
};

const normaliseBreakpointsArray = (breakpoints: BreakpointsArray): BreakPairArray => {
    return breakpoints.reduce((out: BreakPairArray, curr) => {
        if (
            (typeof curr === 'number' || typeof curr === 'string') && 
            !isOfValueNaN(parseInt(`${curr}`))
        ) {
            out = [...out, [curr, parseInt(`${curr}`)]];
        } else if (
            typeof curr !== 'number' && typeof curr !== 'string' &&
            isObjectLiteral(curr)
        ) {
            out = [...out, ...parseBreakpointsObject(curr)];
        }
        return out;
    }, []);
};

const getNormalisedInput = (input: unknown): BreakPairArray | null => {
    if (Array.isArray(input)) {
        return sortBreakPairArray(normaliseBreakpointsArray(input));
    } else if (isObjectLiteral(input)) {
        return sortBreakPairArray(parseBreakpointsObject(input as UnknownObject));
    }
    return null;
};

const createDataMap = (breakpairs: BreakPairArray): MappedValues => {
    if (!breakpairs) return null;
    return breakpairs.reduce((out: MappedValues, bp) => {
        out.keys.push(bp[0]);
        out.entries[bp[0]] = bp[1];
        return out;
    }, {keys: [], entries: {}});
};

const addFloor = (map: MappedValues, val: FloorType): void => {
    if (map.entries[map.keys[0]] !== 0) {
        const floorKey = 
            typeof val === 'string' || 
            typeof val === 'number' && !isOfValueNaN(val) ?
            val : '_';
        
        map.keys.unshift(floorKey);
        map.entries[floorKey] = 0;
    }
};

const getBreakIndex = (map: MappedValues, t: number) => {
    return map.keys.findIndex((key, i, arr) => {
        const val = map.entries[key];
        const next = map.entries[arr[i + 1]];
        return t >= val && t < (next || t + 1);
    });
}

// Base Hook

const useBreakpoints = (
    widthPoints?: Breakpoints,
    heightPoints?: Breakpoints, 
    createFloor?: FloorType
): BreakpointReturns  => {

    // This should ALWAYS return a MappedValues object, even if its empty
    // Might be best to go back to break objects to do it
    const normalisedBreakpoints = React.useMemo(() => {
        const widths = getNormalisedInput(widthPoints);
        const heights = getNormalisedInput(heightPoints);

        const widthMap = createDataMap(widths);
        const heightMap = createDataMap(heights);

        if (widthMap && createFloor) addFloor(widthMap, createFloor);
        if (heightMap && createFloor) addFloor(heightMap, createFloor);

        return {
            widthMap,
            heightMap
        }
    }, [widthPoints, heightPoints, createFloor]);

    const getBreakpointData = React.useCallback((dim: Dim, testVal: number) => {
        const { widthMap, heightMap } = normalisedBreakpoints;

        const chosenMap = dim === Dim.WIDTH ? widthMap : heightMap;
        if (!chosenMap) return null;

        // Is this repeat index search necessary?
        // If we know all the indexes up front, all we have to do
        // is track the prev and next ones and compare document dim.
        const index = getBreakIndex(chosenMap, testVal);

        return {
            value: chosenMap.keys[index],
            index,
            keys: chosenMap.keys,
            entries: chosenMap.entries
        }
    }, [normalisedBreakpoints]);

    /* 
    |   React State and Refs
    */

    const [widthPoint, setWidthPoint] = React.useState<BreakpointData>(
        getBreakpointData(Dim.WIDTH, getDocumentDim(Dim.WIDTH))
    );
    const [heightPoint, setHeightPoint] = React.useState<BreakpointData>(
        getBreakpointData(Dim.HEIGHT, getDocumentDim(Dim.HEIGHT))
    );

    const prevWidth = React.useRef(getDocumentDim(Dim.WIDTH));
    const prevHeight = React.useRef(getDocumentDim(Dim.HEIGHT));

    /* 
    |   Add resize event listener.
    */

    React.useEffect(() => {
        const checkBreakpoints = () => {
            const docWidth = getDocumentDim(Dim.WIDTH);
            const docHeight = getDocumentDim(Dim.HEIGHT);

            const widthChanged = docWidth !== prevWidth.current;
            const heightChanged = docHeight !== prevHeight.current;

            const checkState = (p: BreakpointData, n: BreakpointData) => {
                const sameKey = p.value === n.value;
                const sameValue = p.entries[p.value] === n.entries[n.value];
                return sameKey && sameValue ? p : n;
            };

            if (widthChanged) {
                setWidthPoint(p => checkState(p, getBreakpointData(Dim.WIDTH, docWidth)));
                prevWidth.current = docWidth;
            }

            if (heightChanged) {
                setHeightPoint(p => checkState(p, getBreakpointData(Dim.HEIGHT, docHeight)));
                prevHeight.current = docHeight;
            }
        };

        window.addEventListener('resize', checkBreakpoints);

        return () => window.removeEventListener('resize', checkBreakpoints);
    }, [getBreakpointData]);

    return { widthPoint, heightPoint };
};

// Encapsulate hook with context

const BothContext = React.createContext(null);
const WidthContext = React.createContext(null);
const HeightContext = React.createContext(null);

const BreakContextProvider: React.FC<IBreakpointProvider> = ({
    widthpoints, 
    heightpoints, 
    createFloor, 
    children
}) => {
    const breakpoints = useBreakpoints(
        widthpoints, 
        heightpoints, 
        createFloor
    );

    return (
        <BothContext.Provider value={breakpoints}>
            <WidthContext.Provider value={breakpoints.widthPoint}>
                <HeightContext.Provider value={breakpoints.heightPoint}>
                    {children}
                </HeightContext.Provider>
            </WidthContext.Provider>
        </BothContext.Provider>
    )
};

const useBreakpointContext = (): BreakpointData => {
    return React.useContext(BothContext);
};

const useWidthpointContext = (): BreakpointData => {
    return React.useContext(WidthContext);
}

const useHeightpointContext = (): BreakpointData => {
    return React.useContext(HeightContext);
};

// Exports

export { 
    BreakContextProvider, 
    useBreakpointContext,
    useWidthpointContext,
    useHeightpointContext
};

export default useBreakpoints;