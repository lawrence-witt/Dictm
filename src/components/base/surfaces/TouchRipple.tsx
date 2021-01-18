import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { RippleHandle } from '../styleconfig/styleconfig.d';
import { useTheme, IThemeObject } from '../theme';

// Types

interface ITouchRipple {
    centre?: boolean;
    shade?: 'light' | 'dark';
    primary?: string | boolean;
    forceBlur: () => void;
}

interface RippleObject {
    id: number;
    active: boolean;
    x: number,
    y: number,
    size: number,
}

interface ITouchRippleInstance extends RippleObject {
    primary?: string | boolean;
    onComplete: (id: number) => void;
}

interface ITouchRippleContainer {
    $theme: IThemeObject;
    $shade: 'light' | 'dark';
    $focussed: boolean;
}

// Styled

const rippleEnter = keyframes`
    0% {
        transform: scale(0);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 0.44;
    }
`;

const TouchRippleContainer = styled.span<ITouchRippleContainer>`
    display: block;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: inherit;
    position: absolute;
    overflow: hidden;
    z-index: 0;
    background: ${({$focussed, $theme, $shade}) => {
        if ($focussed) return $theme.color.states[$shade].focussed;
        return 'transparent';
    }};
    transition: background 200ms;

    :hover {
        background: ${({$theme, $shade}) => {
            return $theme.color.states[$shade].hovered;
        }}
    }
`;

const RippleWrapper = styled.span.attrs((
    {$top, $left}: {$top: number, $left: number}
) => ({
    style: {
        top: $top,
        left: $left
    }
}))<{
    $active: boolean, $size: number, $top: number, $left: number
}>`
    display: block;
    position: absolute;
    width: ${({$size}) => `${$size}px`};
    height: ${({$size}) => `${$size}px`};
    opacity: ${({$active}) => $active ? 1 : 0};
    transition: opacity 550ms 100ms;
`;

const RippleElement = styled.span<{
    $theme: IThemeObject;
    $primary: string | boolean
}>`
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transform: scale(0);
    background: ${({$theme, $primary}) => {
        if (typeof $primary === 'string') return $primary;
        if ($primary) return $theme.color.primary.main;
        return $theme.color.states.dark.enabled;
    }};
    border-radius: 50%;
    animation-name: ${rippleEnter};
    animation-duration: 550ms;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
`;

// Components

const TouchRipple = React.forwardRef <
    RippleHandle, ITouchRipple
> (function TouchRipple(props, ref) {
    const {
        centre,
        shade,
        primary,
        forceBlur
    } = props;

    const theme = useTheme();

    const isStarted = React.useRef<boolean>(false);
    const nextRippleId = React.useRef<number>(0);

    const [focussed, setFocussed] = React.useState<boolean>(false);
    const [ripples, setRipples] = React.useState<RippleObject[]>([]);

    const containerRef = React.useRef<HTMLSpanElement>();

    /* const calcRipple =  */

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

    const focus = React.useCallback(() => {
        setFocussed(true);
    }, []);

    // Fade all ripples from the surface

    const stop = React.useCallback((event) => {
        isStarted.current = false;

        setFocussed(false);

        if (event.type === 'mouseup' || event.type === 'touchend') {
            forceBlur();
            return;
        }

        setRipples(ripples => {
            if (ripples.length === 0) return ripples;
            return ripples.map(r => ({...r, active: false}));
        });
    }, [forceBlur]);

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
            $theme={theme}
            $shade={shade}
            $focussed={focussed}
        >
            {ripples.map(({id, active, x, y, size}) => (
                <TouchRippleInstance
                    key={id}
                    id={id}
                    active={active}
                    x={x}
                    y={y}
                    size={size}
                    primary={primary}
                    onComplete={removeRipple}
                />
            ))}
        </TouchRippleContainer>
    );
});

const TouchRippleInstance = React.memo(
    function TouchRippleInstance(
        {id, active, x, y, size, primary, onComplete}: ITouchRippleInstance
    ) {
        const top = -(size / 2) + y;
        const left = -(size / 2) + x;

        const theme = useTheme();

        return (
            <RippleWrapper
                $active={active}
                $size={size}
                $top={top}
                $left={left}
                onTransitionEnd={() => onComplete(id)}
            >
                <RippleElement $theme={theme} $primary={primary}/>
            </RippleWrapper>
        );
    }
);

// Exports

export default TouchRipple;