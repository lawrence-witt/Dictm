import React from 'react';
import styled from 'styled-components';

import Typography from '../misc/Typography';

import { contentConfig } from '../styleconfig/styleconfig';
import { 
    JSXContentProps, 
    StyledContentProps 
} from '../styleconfig/styleconfig.d';

// Types

interface TabProps extends JSXContentProps {
    label: string;
}

// Styled

const StyledBase = styled.div`
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    background: #6200EE;
`;

const StyledTab = styled.span<StyledContentProps>`
    display: block;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    svg {
        ${({$shade, $state}) => {
            const { color: fill, opacity } = contentConfig($shade, $state);
            return { fill, opacity };
        }}
    }
`;

const IconContainer = styled.span`
    display: block;
    width: 24px;
    height: 24px;
`;

// Components

const Base: React.FC = ({
    children
}): React.ReactElement => {
    return (
        <StyledBase>
            {children}
        </StyledBase>
    );
};

const Tab: React.FC<TabProps> = ({
    shade, state, label, jsx: Icon
}): React.ReactElement => {
    return (
        <StyledTab
            $shade={shade}
            $state={state}
        >
            {Icon && (
                <IconContainer>
                    <Icon />
                </IconContainer>
            )}
            <Typography 
                variant={Icon ? 'caption' : 'body2'} 
                shade={shade} 
                state={state}
            >
                {Icon ? label : label.toUpperCase()}
            </Typography>
        </StyledTab>
    );
};

export { Base, Tab };