export default function removeDuplicateModels<
    T extends {[key: string]: any},
    K extends keyof T
>(objs: T[], key: K): T[] {
    return objs.reduce((out: {
        map: Record<string, true>,
        values: T[]
    }, curr) => {
        if (!out.map[curr[key]]) {
            out.map[curr[key]] = true;
            out.values.push(curr);
        }
        return out;
    }, {map: {}, values: []}).values;
}