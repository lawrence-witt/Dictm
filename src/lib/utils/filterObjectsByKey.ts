export default function filterObjectsByKey<
    T extends {[key: string]: any},
    K extends keyof T
>(objs: T[], key: K): T[] {
    return objs.reduce((out: {
        map: Map<any, undefined>,
        values: T[]
    }, curr) => {
        if (!out.map.has(curr[key])) {
            out.map.set(curr[key], undefined);
            out.values.push(curr);
        }
        return out;
    }, {map: new Map(), values: []}).values;
}