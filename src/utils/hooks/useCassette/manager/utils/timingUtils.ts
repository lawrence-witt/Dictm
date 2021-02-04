const msInSecs = (ms: number): number => ms/1000;
const floorSecsByMs = (secs: number, ms: number): number => {
    return +(secs - (secs % msInSecs(ms))).toFixed(2);
};

export {
    msInSecs,
    floorSecsByMs
};