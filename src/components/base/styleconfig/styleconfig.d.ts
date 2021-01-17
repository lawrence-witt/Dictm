// Surfaces

export interface SurfaceProps<T, E> extends React.HTMLProps<E> {
    tag?: T;
}

export type AnySurfaceProps = SurfaceProps<React.ElementType, HTMLElement>;

export interface RippleHandle {
    [key: string]: (event: unknown) => void;
    start: (event: unknown) => void;
    focus: (event: unknown) => void;
    stop: (event: unknown) => void;
}

// Content

export type ContentShade = 'light' | 'dark';
export type ContentColors = '#FFFFFF' | '#000000';
export type ContentState = 'focussed' | 'enabled' | 'disabled';

export interface ContentScheme {
    color: ContentColors;
    states: {
        [key in ContentState]: number;
    }
}

export interface StyledContentProps {
    $shade: ContentShade;
    $state: ContentState;
}

export interface ContentProps {
    shade?: ContentShade;
    state?: ContentState;
}

export interface JSXContentProps extends ContentProps {
    jsx?: React.ComponentType;
}