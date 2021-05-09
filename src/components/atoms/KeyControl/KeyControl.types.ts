export interface KeyControlProps<Keys extends string[], K = [...Keys][number]> {
    className?: string;
    keys: [...Keys];
    children: (
        key: K | undefined, 
        setKey: (key: K | undefined) => void
    ) => JSX.Element | null;
}