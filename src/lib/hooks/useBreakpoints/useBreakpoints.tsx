import React from 'react';
import isEqual from 'react-fast-compare';

import * as types from './useBreakpoints.types';

const getDocumentWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

const belowMedia = (val: number) => `(max-width: ${val}px)`;
const betweenMedia = (min: number, max: number) => `(min-width: ${min}px) and (max-width: ${max}px)`;
const aboveMedia = (val: number) => `(min-width: ${val}px)`;

const getBreakpointsData = (
    breakpoints: types.Breakpoints
) => {
    const keys = Object.keys(breakpoints);
    const values = Object.values(breakpoints);

    const initialIdx = values.findIndex((value, i, arr) => {
        const nextValue = arr[i+1];
        return window.matchMedia(betweenMedia(value, nextValue || getDocumentWidth())).matches;
    });

    return {
        current: initialIdx === -1 ? undefined : keys[initialIdx],
        index: initialIdx,
        keys,
        map: breakpoints
    }
}

const watchBreakpointsData = (
    breakpointsData: types.BreakpointsData, 
    cb: (i: number) => void
) => {
    const onChange = (i: number) => (event: MediaQueryListEvent) => {
        cb(event.matches ? i : i - 1);
    }

    const watchList = Object.values(breakpointsData.map).reduce((list: types.WatchList, value, i) => {
        const query = window.matchMedia(aboveMedia(value));
        const handler = onChange(i);
        query.addEventListener('change', handler);
        return [...list, { query, handler }];
    }, []);

    return {
        unwatch: () => {
            watchList.forEach(record => record.query.removeEventListener("change", record.handler));
        }
    }
}

const useBreakpoints = (
    breakpoints: types.Breakpoints
): types.BreakpointsData => {
    const formattedData = React.useMemo(() => getBreakpointsData(breakpoints), [breakpoints]);

    const [data, setData] = React.useState(formattedData);

    React.useEffect(() => {
        const watchList = watchBreakpointsData(formattedData, (index) => {
            setData(d => ({ ...d, current: d.keys[index], index }));
        });

        setData(d => isEqual(d, formattedData) ? d : formattedData);

        return () => watchList.unwatch();
    }, [formattedData]);

    return data;
};

export default useBreakpoints;