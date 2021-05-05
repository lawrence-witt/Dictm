export type Breakpoints = Record<string, number>;

export interface BreakpointsData {
    current: string | undefined;
    index: number;
    keys: Array<string | number>;
    map: Breakpoints;
}

export type WatchList = Array<{
    query: MediaQueryList;
    handler: (event: MediaQueryListEvent) => void;
}>