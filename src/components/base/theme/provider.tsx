import * as React from 'react';

import useMergedStyles from '../utilities/hooks/useMergedStyles';
import { defaultTheme, IThemeObject } from './';

interface IThemeProvider {
    value?: {
        [key: string]: unknown;
    }
}

const ThemeContext = React.createContext(defaultTheme);

const ThemeProvider: React.FC<IThemeProvider> = ({value, children}) => {
    const merged = useMergedStyles(defaultTheme, value);

    return (
        <ThemeContext.Provider value={merged}>
            {children}
        </ThemeContext.Provider>
    )
};

const useTheme = (): IThemeObject => React.useContext(ThemeContext);

export { ThemeProvider, useTheme };