import React from 'react';
import styled from 'styled-components';

import { SurfaceProps } from '../styleconfig/styleconfig.d';

// Styled

const StyledBaseSurface = styled.div<{$style: React.CSSProperties}>`
    ${({$style}) => ({...$style})}
`;

// Component

const BaseSurface: React.FC<SurfaceProps> = (props) => {
    const {
        tag,
        style,
        forwardRef,
        children,
        ...other
    } = props;

    return (
        <StyledBaseSurface
            {...other}
            as={tag || 'div'}
            ref={forwardRef}
            $style={style || {}}
        >
            {children}
        </StyledBaseSurface>
    )
};

// Exports

export default BaseSurface;