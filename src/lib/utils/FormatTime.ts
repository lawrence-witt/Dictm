export const formatTimestamp = (stamp: number): string => {
    return new Intl.DateTimeFormat(undefined, {
        day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(stamp));
}

export const formatDuration = (secs: number): {m: string; s: string; cs: string} => {
    const d = new Date(secs * 1000);

    const addZero = (n: number) => n < 10 ? `0${n}`: `${n}`;

    const m = addZero(d.getMinutes());
    const s = addZero(d.getSeconds());
    const cs = addZero(Math.floor(d.getMilliseconds() / 10));

    return {m, s, cs};
}