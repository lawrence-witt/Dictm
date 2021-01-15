import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

import { SurfaceProps } from '../styleconfig/styleconfig.d';

import BaseSurface from './BaseSurface';
import TouchRipple, { RippleContainer } from './TouchRipple';

// Types

interface RippleObject {
    id: number;
    active: boolean;
}

// Styled

// Components

const TouchSurface: React.FC<SurfaceProps> = ({
    children, ...props
}): React.ReactElement => {
    const {
        onClick,
        onFocus,
        onBlur,
        onMouseDown,
        onMouseUp,
        onMouseLeave,
        ...other
    } = props;

    const nextRippleId = useRef<number>(0);
    const [ripples, setRipples] = useState<RippleObject[]>([]);

    // Ripple Modifiers

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

    const removeRipple = useCallback((id: number) => {
        setRipples(rips => rips.filter(r => r.id !== id));
    }, []);

    // Event Handlers

    const surfaceFocus = (e: React.FocusEvent, cb: (e: React.FocusEvent) => void) => {
        // Add a centre ripple in all modes

        cb && cb(e);
    };

    const surfaceBlur = (e: React.FocusEvent, cb: (e: React.FocusEvent) => void) => {
        // Fade out all ripples
        cb && cb(e);
    };

    const surfaceClick = (e: React.MouseEvent, cb: (e: React.MouseEvent) => void) => {
        e.preventDefault();

        // Trigger an x/y positioned ripple
        // Unless we're in 'centre' mode, then position in centre
        
        // In regular mode, ripple must completely cover the element
        // In 'centre' mode, ripple is the size of the longest edge (minus a bit)

        cb && cb(e);
    };

    const surfaceExit = (e: React.MouseEvent, cb: (e: React.MouseEvent) => void) => {
        // Fade out all ripples
        cb && cb(e);
    };

    return (
        <BaseSurface
            onClick={e => onClick && onClick(e)}
            onFocus={e => surfaceFocus(e, onFocus)}
            onBlur={e => surfaceBlur(e, onBlur)}
            onMouseDown={e => surfaceClick(e, onMouseDown)}
            onMouseUp={e => surfaceExit(e, onMouseUp)}
            onMouseLeave={e => surfaceExit(e, onMouseLeave)}
            {...other}
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
        </BaseSurface>
    )
};

// Exports

export default TouchSurface;