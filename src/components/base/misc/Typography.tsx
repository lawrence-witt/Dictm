import React from 'react';
import styled from 'styled-components';

import { 
    contentConfig 
} from '../styleconfig/styleconfig';
import {
    ContentProps,
    StyledContentProps
} from '../styleconfig/styleconfig.d';

// Types

type TextWeight = 400 | 500 | 600;
type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HtmlTags = Headings | 'p';
type UserVariants = Headings | 'body1' | 'body2' | 'caption';

interface TextSizes {
    $fontSize: number;
    $lineHeight: number;
    $fontWeight: TextWeight;
}

interface StyledTypographyProps extends TextSizes, StyledContentProps {}

interface TypographyProps extends ContentProps {
    variant: UserVariants;
}

interface TextConfig extends TextSizes {
    as: HtmlTags;
}

// Config

const textConfig: {[name : string]: TextConfig} = {
    h1: { as: 'h1', $fontSize: 50, $lineHeight: 56, $fontWeight: 500 },
    h2: { as: 'h2', $fontSize: 40, $lineHeight: 42, $fontWeight: 400 },
    h3: { as: 'h3', $fontSize: 30, $lineHeight: 36, $fontWeight: 400 },
    h4: { as: 'h4', $fontSize: 20, $lineHeight: 24, $fontWeight: 600 },
    h5: { as: 'h5', $fontSize: 18, $lineHeight: 24, $fontWeight: 500 },
    h6: { as: 'h6', $fontSize: 15, $lineHeight: 20, $fontWeight: 600 },
    body1: { as: 'p', $fontSize: 20, $lineHeight: 24, $fontWeight: 500 },
    body2: { as: 'p', $fontSize: 15, $lineHeight: 20, $fontWeight: 500 },
    caption: { as: 'p', $fontSize: 12, $lineHeight: 16, $fontWeight: 500 }
};

// Styled

const StyledBase = styled.p<StyledTypographyProps>`
    ${({$shade, $state, $fontSize, $lineHeight, $fontWeight}) => {
        const { color, opacity } = contentConfig($shade, $state);
        return {
            color,
            opacity,
            'font-size': `${$fontSize}px`,
            'line-height': `${$lineHeight}px`,
            'font-weight': `${$fontWeight}`
        };
    }}
`;

// Component

const Typography: React.FC<TypographyProps> = ({
    variant, shade, state, children
}): React.ReactElement => (
    <StyledBase
        $shade={shade}
        $state={state}
        {...textConfig[variant || 'body2']}
    >
        {children}
    </StyledBase>
);

// Exports

export default Typography;