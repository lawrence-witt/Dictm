import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import TouchRipple, { RippleContainer } from './TouchRipple';

// Types

interface RippleObject {
    id: number;
    active: boolean;
}

// Styled

const ButtonSurface = styled.button`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 50%;
    transition: background 200ms;
    z-index: 0;

    :hover {
        background: rgba(0, 0, 0, 0.12);
    }
`;

// Component

const ButtonBase: React.FC = ({children}): React.ReactElement => {
    const buttonRef = useRef<HTMLButtonElement>();
    const nextRippleId = useRef<number>(0);

    const [ripples, setRipples] = useState<RippleObject[]>([]);

    const addRipple = () => {
        setRipples(rips => [...rips, {
            id: nextRippleId.current,
            active: true
        }]);
        nextRippleId.current += 1;
    };

    const fadeRipples = () => {
        setRipples(rips => rips.map(r => ({...r, active: false})));
    };

    const removeRipple = (id: number) => setRipples(rips => rips.filter(r => r.id !== id));

    const handleUnfocus = () => buttonRef.current.blur();

    return (
        <ButtonSurface
            ref={buttonRef}
            onFocus={() => addRipple()}
            onBlur={() => fadeRipples()}
            onMouseUp={() => handleUnfocus()}
            onMouseLeave={() => handleUnfocus()}
        >
            {children}
            <RippleContainer>
                {ripples.map(rip => (
                    <TouchRipple 
                        key={rip.id}
                        id={rip.id}
                        active={rip.active}
                        onComplete={removeRipple}
                    />
                ))}
            </RippleContainer>
        </ButtonSurface>
    )
};

// Exports

export default ButtonBase;