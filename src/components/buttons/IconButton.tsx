import React from 'react';
import styled from 'styled-components';

import ButtonBase from './ButtonBase';

// Styled

const IconContainer = styled.span`
    height: 24px;
    width: 24px;
    fill: white;
`;

// Component

const IconButton: React.FC = ({children: icon}): React.ReactElement => {
    return (
        <ButtonBase>
            <IconContainer>
                {icon}
            </IconContainer>
        </ButtonBase>
    );
};

// Exports

export default IconButton;