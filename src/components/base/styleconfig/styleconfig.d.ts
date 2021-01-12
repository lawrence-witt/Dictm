// Content

export type ContentShade = 'light' | 'dark';
export type ContentColors = '#FFFFFF' | '#000000';
export type ContentState = 'focussed' | 'enabled' | 'disabled';

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