import React from 'react';
import styled from 'styled-components';

import { AnySurfaceProps } from '../styleconfig/styleconfig.d';

// Styled

const StyledBaseSurface = styled.div<{$style: React.CSSProperties}>`
    ${({$style}) => ({...$style})}
`;

// Component

const BaseSurface = React.forwardRef <
    HTMLElement, 
    AnySurfaceProps
> (function BaseSurface(props, ref) {
    const {
        tag,
        style,
        children,
        ...other
    } = props;

    return (
        <StyledBaseSurface
            {...other}
            as={tag || 'div'}
            ref={ref}
            $style={style || {}}
        >
            {children}
        </StyledBaseSurface>
    )
})

// Exports

export default BaseSurface;