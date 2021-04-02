import React from 'react';
import isEqual from 'react-fast-compare'
import { useLocation } from 'react-router-dom';

const useQueryMatch = (args: Record<string, string[]>): Record<string, string | null> => {
    const location = useLocation();

    const getMatches = React.useCallback(() => {
        const query = new URLSearchParams(location.search);
        return Object.keys(args).reduce((map: Record<string, string | null>, name) => {
            const value = query.get(name);
            const included = value && (args[name].length === 0 || args[name].includes(value));

            map[name] = value && included ? value : null;
            return map;
        }, {});
    }, [args, location.search]);

    const [matches, setMatches] = React.useState(getMatches);

    React.useLayoutEffect(() => {
        setMatches(m => {
            const newMatches = getMatches();
            return isEqual(m, newMatches) ? m : newMatches;
        });
    }, [getMatches]);
    
    return matches;
}

export default useQueryMatch;