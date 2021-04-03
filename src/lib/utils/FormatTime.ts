export const formatShortTimestamp = (stamp: number): string => {
    return new Intl.DateTimeFormat('default', {
        day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(stamp));
}

export const formatLongTimestamp = (stamp: number): string => {
    return new Intl.DateTimeFormat('default', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
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