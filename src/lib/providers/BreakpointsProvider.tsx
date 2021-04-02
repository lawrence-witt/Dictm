import React from 'react';
import { useTheme } from '@material-ui/core/styles';

import { BreakContextProvider } from '../hooks/useBreakpoints';

const BreakpointsProvider: React.FC = ({children}) => {
    const theme = useTheme();

    const breakpoints = React.useMemo(() => {
        const { lg, xl, ...rest } = theme.breakpoints.values;
        return [{...rest}];
    }, [theme]);

    return (
        <BreakContextProvider breakpoints={breakpoints}>
            {children}
        </BreakContextProvider>
    )
};

export default BreakpointsProvider;