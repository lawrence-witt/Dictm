import React from 'react';
import { useTheme } from '@material-ui/core/styles';

import useBreakpoints from '../hooks/useBreakpoints/useBreakpoints';
import { BreakpointsData } from '../hooks/useBreakpoints/useBreakpoints.types';

const BreakpointsContext = React.createContext<ReturnType<typeof useBreakpoints> | null>(null);

const BreakpointsProvider: React.FC = ({children}) => {
    const theme = useTheme();

    const breakpoints = React.useMemo(() => {
        const { lg, xl, ...rest } = theme.breakpoints.values;
        return { ...rest };
    }, [theme]);

    const breakpointsData = useBreakpoints(breakpoints);

    return (
        <BreakpointsContext.Provider value={breakpointsData}>
            {children}
        </BreakpointsContext.Provider>
    )
}

const useBreakpointsContext = (): BreakpointsData => {
    const context = React.useContext(BreakpointsContext);
    if (!context) throw new Error('useBreakContext must be used within BreakContextProvider.')
    return context;
};

export { BreakpointsProvider, useBreakpointsContext };