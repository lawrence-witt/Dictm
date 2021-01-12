import React from 'react';
import styled from 'styled-components';

import { contentConfig } from '../styleconfig/styleconfig';
import { JSXContentProps, StyledContentProps } from '../styleconfig/styleconfig.d';

import ButtonBase from './ButtonBase';

// Styled

const IconContainer = styled.span<StyledContentProps>`
    height: 24px;
    width: 24px;
    
    svg {
        ${({$shade, $state}) => {
            const { color: fill, opacity } = contentConfig($shade, $state);
            return { fill, opacity };
        }
    }
`;

// Component

const IconButton: React.FC<JSXContentProps> = ({
    shade, state, jsx: Icon
}): React.ReactElement => {
    return (
        <ButtonBase>
            <IconContainer 
                $shade={shade}
                $state={state}
            >
                {Icon && <Icon />}
            </IconContainer>
        </ButtonBase>
    );
};

// Exports

export default IconButton;