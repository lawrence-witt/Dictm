import { BoxProps } from '@material-ui/core/Box';

import { SpringValue } from 'react-spring';

export interface EditorContentProps extends BoxProps {
    disableGutters?: boolean;
    springStyle?: {
        transform: SpringValue<string>;
    }
}