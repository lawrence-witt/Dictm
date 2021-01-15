import React from 'react';
import styled from 'styled-components';

import { SurfaceProps } from '../styleconfig/styleconfig.d';

// Styled

const StyledBaseSurface = styled.div<{$style: React.CSSProperties}>`
    ${({$style}) => ({...$style})}
`;

// Component

const BaseSurface: React.FC<SurfaceProps> = ({
    children, ...props
}): React.ReactElement => {
    const {
        as,
        forwardedRef,
        style,
        ...other
    } = props;

    return (
        <StyledBaseSurface
            as={as || 'div'}
            ref={forwardedRef}
            $style={style || {}}
            {...other}
        >
            {children}
        </StyledBaseSurface>
    );
};

// Exports

export default BaseSurface;