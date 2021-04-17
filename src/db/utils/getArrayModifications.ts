export default function getArrayModifications<T>(prev: T[], next: T[]):{
    added: T[];
    removed: T[];
} {
    return {
        added: next.filter(n => !prev.includes(n)),
        removed: prev.filter(p => !next.includes(p))
    }
}