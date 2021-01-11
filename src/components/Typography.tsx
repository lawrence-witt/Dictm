import React from 'react';
import styled from 'styled-components';

// Types

type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HtmlTags = Headings | 'p';
type UserTags = Headings | 'body1' | 'body2' | 'caption';
type TextShade = 'light' | 'dark';
type TextState = 'focussed' | 'enabled' | 'disabled';
type TextWeight = 'lighter' | 'normal' | 'bold';

interface TextSizes {
    $fontSize: number;
    $lineHeight: number;
    $fontWeight: TextWeight;
}

interface StyledBaseProps extends TextSizes {
    $shade: TextShade
    $state: TextState
}

interface TagConfig extends TextSizes {
    as: HtmlTags;
}

interface UserOptions {
    tag: UserTags;
    shade?: TextShade;
    state?: TextState;
}

// Config

const styleConfig = {
    light: {
        color: '#FFFFFF',
        states: { focussed: 1, enabled: 0.76, disabled: 0.34 }
    },
    dark: {
        color: '#000000',
        states: { focussed: 0.87, enabled: 0.54, disabled: 0.12 }
    }
};

const tagConfig: {[name : string]: TagConfig} = {
    h1: { as: 'h1', $fontSize: 50, $lineHeight: 56, $fontWeight: 'normal' },
    h2: { as: 'h2', $fontSize: 40, $lineHeight: 42, $fontWeight: 'lighter' },
    h3: { as: 'h3', $fontSize: 30, $lineHeight: 36, $fontWeight: 'lighter' },
    h4: { as: 'h4', $fontSize: 20, $lineHeight: 24, $fontWeight: 'bold' },
    h5: { as: 'h5', $fontSize: 18, $lineHeight: 24, $fontWeight: 'normal' },
    h6: { as: 'h6', $fontSize: 15, $lineHeight: 20, $fontWeight: 'bold' },
    body1: { as: 'p', $fontSize: 20, $lineHeight: 24, $fontWeight: 'normal' },
    body2: { as: 'p', $fontSize: 15, $lineHeight: 20, $fontWeight: 'normal' },
    caption: { as: 'p', $fontSize: 12, $lineHeight: 16, $fontWeight: 'normal' },
};

// Styled

const StyledBase = styled.p<StyledBaseProps>`
    color: ${({$shade}) => styleConfig[$shade].color};
    opacity: ${({$shade, $state}) => styleConfig[$shade].states[$state]};
    font-size: ${({$fontSize}) => $fontSize}px;
    line-height: ${({$lineHeight}) => $lineHeight}px;
    font-weight: ${({$fontWeight}) => $fontWeight};
`;

// Component

const Typography: React.FC<UserOptions> = ({
    tag, shade, state, children
}): React.ReactElement => (
    <StyledBase
        $shade={shade || 'dark'}
        $state={state || 'focussed'}
        {...tagConfig[tag || 'body2']}
    >
        {children}
    </StyledBase>
);

// Exports

export default Typography;