import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

import { SurfaceProps, RippleHandle } from '../styleconfig/styleconfig.d';
import useMergedStyles from '../utilities/hooks/useMergedStyles';
import useEventCallback from '../utilities/hooks/useEventCallback';
import { useTheme } from '../theme';

import BaseSurface from './BaseSurface';
import TouchRipple from './TouchRipple';

// Types

interface TouchSurfaceProps extends SurfaceProps {
    centre?: boolean;
    shade?: 'light' | 'dark';
    primary?: string | boolean;
}

// Styled

const defaultStyles: React.CSSProperties = {
    cursor: "pointer",
    position: "relative",
    background: 'transparent',
    border: 0,
    outline: 0,
    padding: 0,
    margin: 0,
    transition: 'background 200ms'
}

// Component

const TouchSurface: React.FC<TouchSurfaceProps> = (props) => {
    const {
        centre = false,
        shade = 'dark',
        primary = false,
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
        forwardRef,
        children,
        ...other
    } = props;

    const tempRef = useRef<HTMLElement>();
    const rippleRef = useRef<RippleHandle>();

    const mergedStyles = useMergedStyles(defaultStyles, style);

    // Ripple Handlers

    function useRippleHandler<T extends {type: string}>(
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

    const forceBlur = useCallback(() => {
        tempRef.current.blur();
    }, []);

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
            forwardRef={tempRef}
            {...other}
        >
            {children}
            <TouchRipple 
                ref={rippleRef} 
                centre={centre}
                shade={shade} 
                primary={primary}
                forceBlur={forceBlur}
            />
        </BaseSurface>
    );
}

// Exports

export default TouchSurface;