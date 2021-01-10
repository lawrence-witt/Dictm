import React from 'react';
import styled, { keyframes } from 'styled-components';

// Types

interface TouchRippleProps {
    id: number;
    active: boolean;
    onComplete: (id: number) => void;
}

// Styled

const rippleEnter = keyframes`
    0% {
        transform: scale(0);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 0.34;
    }
`;

const RippleContainer = styled.span`
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
`;

const RippleWrapper = styled.span<{active: boolean}>`
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: ${({active}) => active ? 1 : 0};
    transition: opacity 550ms 100ms;
`;

const RippleElement = styled.span`
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transform: scale(0);
    background: white;
    border-radius: 50%;
    animation-name: ${rippleEnter};
    animation-duration: 500ms;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
`;

// Component

const TouchRipple: React.FC<TouchRippleProps> = ({
    id, active, onComplete
}): React.ReactElement => {
    return (
        <RippleWrapper active={active} onTransitionEnd={() => onComplete(id)}>
            <RippleElement />
        </RippleWrapper>
    )
};

// Exports

export { RippleContainer };
export default TouchRipple;