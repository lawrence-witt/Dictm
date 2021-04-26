import { EnhancerOptions } from 'redux-devtools-extension';

// https://github.com/zalmoxisus/redux-devtools-extension/pull/731
/* eslint-disable @typescript-eslint/ban-types */
export type CorrectEnhancerOptions = Omit<EnhancerOptions, "serialize"> & {
    serialize?: boolean | {
        date?: boolean;
        regex?: boolean;
        undefined?: boolean;
        error?: boolean;
        symbol?: boolean;
        map?: boolean;
        set?: boolean;
        function?: boolean | Function;
            options?: boolean | {
            date?: boolean;
            regex?: boolean;
            undefined?: boolean;
            error?: boolean;
            symbol?: boolean;
            map?: boolean;
            set?: boolean;
            function?: boolean | Function;
        };
        replacer?: (key: string, value: any) => any;
        reviver?: (key: string, value: any) => any;
        immutable?: object;
        refs?: any[];
    };
}

export type TypedArray = 
|   Int8Array 
|   Uint8Array 
|   Int16Array 
|   Uint16Array 
|   Int32Array 
|   Uint32Array 
|   Uint8ClampedArray 
|   Float32Array 
|   Float64Array;

export const isTypedArray = (value: unknown): value is TypedArray => {
    return (
        value instanceof Int8Array ||
        value instanceof Uint8Array ||
        value instanceof Uint16Array ||
        value instanceof Int32Array ||
        value instanceof Uint32Array ||
        value instanceof Uint8ClampedArray ||
        value instanceof Float32Array ||
        value instanceof Float64Array
    );
}