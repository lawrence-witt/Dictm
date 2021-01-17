import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { RippleHandle } from '../styleconfig/styleconfig.d';

// Types

interface ITouchRipple {
    centre?: boolean;
}

interface RippleObject {
    id: number;
    active: boolean;
    x: number,
    y: number,
    size: number
}

interface ITouchRippleInstance extends RippleObject {
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

const TouchRippleContainer = styled.span`
    display: block;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: inherit;
    position: absolute;
    overflow: hidden;
    z-index: 0;
`;

const RippleWrapper = styled.span.attrs((
    {$top, $left}: {$top: number, $left: number}
) => ({
    style: {
        top: $top,
        left: $left
    }
}))<{$active: boolean, $size: number, $top: number, $left: number}>`
    display: block;
    position: absolute;
    width: ${({$size}) => `${$size}px`};
    height: ${({$size}) => `${$size}px`};
    opacity: ${({$active}) => $active ? 1 : 0};
    transition: opacity 550ms 100ms;
`;

const RippleElement = styled.span`
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transform: scale(0);
    background: black;
    border-radius: 50%;
    animation-name: ${rippleEnter};
    animation-duration: 550ms;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
`;

// Components

// https://codesandbox.io/s/gre7p?file=/demo.tsx

const TouchRipple = React.forwardRef <
    RippleHandle, ITouchRipple
> (function TouchRipple(props, ref) {
    const {
        centre
    } = props;

    const isStarted = React.useRef<boolean>(false);
    const nextRippleId = React.useRef<number>(0);
    const [ripples, setRipples] = React.useState<RippleObject[]>([]);

    const containerRef = React.useRef<HTMLSpanElement>();

    // Add a ripple to the surface

    const start = React.useCallback((event) => {
        isStarted.current = true;
        
        const element = containerRef.current;
        const rect = element.getBoundingClientRect();

        let x: number;
        let y: number;

        // Get offset values from rect size/position
        if (
            centre ||
            (event.clientX === 0 && event.clientY === 0) ||
            (!event.clientX && !event.touches)
        ) {
            x = Math.round(rect.width/2);
            y = Math.round(rect.height/2);
        } else {
            const { clientX, clientY } = event.touches ? event.touches[0] : event;
            x = Math.round(clientX - rect.left);
            y = Math.round(clientY - rect.top);
        }

        // Get size value from rect diagonal length
        const radius = Math.round(Math.sqrt(rect.height ** 2 + rect.width ** 2));
        let size = centre ? radius : radius * 2;

        // Fix Chrome Mobile glitch
        if (size % 2 === 0) size += 1;

        setRipples(ripples => [...ripples, {
            id: nextRippleId.current,
            active: true,
            x,
            y,
            size
        }]);
        nextRippleId.current += 1;
    }, [centre]);

    // Add a focus ring to the surface

    const focus = React.useCallback((event) => {
        if (!isStarted.current) {
            console.log('ripple focus called');
            console.log(event);
        }
    }, []);

    // Fade all ripples from the surface

    const stop = React.useCallback((event) => {
        isStarted.current = false;

        setRipples(ripples => {
            if (ripples.length === 0) return ripples;
            return ripples.map(r => ({...r, active: false}));
        });
    }, []);

    // Remove a ripple from the surface

    const removeRipple = React.useCallback((id: number) => {
        setRipples(rips => rips.filter(r => r.id !== id));
    }, []);

    // Attach handle to forwarded ref for use by TouchSurface

    React.useImperativeHandle(ref, () => ({
        start,
        focus,
        stop
    }), [start, focus, stop]);

    return (
        <TouchRippleContainer
            ref={containerRef}
        >
            {ripples.map(({id, active, x, y, size}) => (
                <TouchRippleInstance
                    key={id}
                    id={id}
                    active={active}
                    x={x}
                    y={y}
                    size={size}
                    onComplete={removeRipple}
                />
            ))}
        </TouchRippleContainer>
    );
});

const TouchRippleInstance = React.memo(
    function TouchRippleInstance(
        {id, active, x, y, size, onComplete}: ITouchRippleInstance
    ) {
        const top = -(size / 2) + y;
        const left = -(size / 2) + x;

        return (
            <RippleWrapper
                $active={active}
                $size={size}
                $top={top}
                $left={left}
                onTransitionEnd={() => onComplete(id)}
            >
                <RippleElement />
            </RippleWrapper>
        );
    }
);

// Exports

export default TouchRipple;