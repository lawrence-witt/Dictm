import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

import { AnySurfaceProps, RippleHandle } from '../styleconfig/styleconfig.d';
import useMergedStyles from '../utilities/hooks/useMergedStyles';
import useEventCallback from '../utilities/hooks/useEventCallback';

import BaseSurface from './BaseSurface';
import TouchRipple from './TouchRipple';

// Types

interface TouchSurfaceProps extends AnySurfaceProps {
    centre?: boolean;
}

// Styled

const defaultStyles: React.CSSProperties = {
    cursor: "pointer",
    position: "relative",
    background: 'transparent',
    border: 0,
    outline: 0,
    padding: 0,
    margin: 0
}

// Component

const TouchSurface = React.forwardRef <
    HTMLElement, 
    TouchSurfaceProps
> (function TouchSurface(props, ref) {
    const {
        centre,
        style,
        onClick,
        onFocus,
        onBlur,
        onMouseDown,
        onMouseUp,
        onMouseLeave,
        onDragLeave,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        children,
        ...other
    } = props;

    const rippleRef = useRef<RippleHandle>();
    const mergedStyles = useMergedStyles(defaultStyles, style);

    // Ripple Handlers

    function useRippleHandler<T>(
        rippleAction: string, 
        eventCallback: (event: T) => void
    ) {
        return useEventCallback<T>(event => {
            if (eventCallback) {
                eventCallback(event);
            }

            rippleRef.current[rippleAction](event);
        });
    }

    const handleFocus = useRippleHandler<React.FocusEvent>('focus', onFocus);
    const handleBlur = useRippleHandler<React.FocusEvent>('stop', onBlur);
    const handleMouseDown = useRippleHandler<React.MouseEvent>('start', onMouseDown);
    const handleMouseUp = useRippleHandler<React.MouseEvent>('stop', onMouseUp);
    const handleMouseLeave = useRippleHandler<React.MouseEvent>('stop', onMouseLeave);
    const handleDragLeave = useRippleHandler<React.DragEvent>('stop', onDragLeave);
    const handleTouchStart = useRippleHandler<React.TouchEvent>('start', onTouchStart);
    const handleTouchMove = useRippleHandler<React.TouchEvent>('stop', onTouchMove);
    const handleTouchEnd = useRippleHandler<React.TouchEvent>('stop', onTouchEnd);

    return (
        <BaseSurface
            {...other}
            onClick={onClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onDragLeave={handleDragLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={mergedStyles}
            ref={ref}
        >
            {children}
            <TouchRipple ref={rippleRef} centre={centre}/>
        </BaseSurface>
    );
});

// Exports

export default TouchSurface;