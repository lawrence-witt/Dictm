import React from 'react';
import styled from 'styled-components';

// Types

type TextAs = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
type TextShade = 'light' | 'dark';
type TextState = 'focussed' | 'enabled' | 'disabled';
type TextWeight = 'lighter' | 'normal' | 'bold';

interface TextBaseProps {
    $shade: TextShade
    $state: TextState
    $fontSize: number;
    $lineHeight: number;
    $fontWeight: TextWeight;
}

interface ComponentBaseProps {
    as?: TextAs;
    $shade?: TextShade;
    $state?: TextState;
    $fontSize: number;
    $lineHeight: number;
    $fontWeight: TextWeight;
}

interface TextImplementProps {
    shade?: TextShade;
    state?: TextState;
}

// Style Config

const config = {
    light: {
        color: '#FFFFFF',
        $states: {
            focussed: 1,
            enabled: 0.76,
            disabled: 0.34
        }
    },
    dark: {
        color: '#000000',
        $states: {
            focussed: 0.87,
            enabled: 0.54,
            disabled: 0.12
        }
    }
};

// Styled

const TextBase = styled.p<TextBaseProps>`
    color: ${({$shade}) => config[$shade].color};
    opacity: ${({$shade, $state}) => config[$shade].$states[$state]};
    font-size: ${({$fontSize}) => $fontSize}px;
    line-height: ${({$lineHeight}) => $lineHeight}px;
    font-weight: ${({$fontWeight}) => $fontWeight};
`;

// Components

const ComponentBase: React.FC<ComponentBaseProps> = ({
    as, $shade, $state, $fontSize, $lineHeight, $fontWeight, children
}): React.ReactElement => (
    <TextBase
        as={as || 'p'}
        $shade={$shade || 'light'} 
        $state={$state || 'focussed'} 
        $fontSize={$fontSize} 
        $lineHeight={$lineHeight}
        $fontWeight={$fontWeight}
    >
        {children}
    </TextBase>
);

const H1: React.FC<TextImplementProps> = ({
    shade, state, children
}): React.ReactElement => (
    <ComponentBase 
        as={'h1'} 
        $shade={shade} 
        $state={state}
        $fontSize={50}
        $lineHeight={56}
        $fontWeight="normal"
    >
        {children}
    </ComponentBase>
);

const H2: React.FC<TextImplementProps> = ({
    shade, state, children
}): React.ReactElement => (
    <ComponentBase 
        as={'h2'} 
        $shade={shade} 
        $state={state}
        $fontSize={40}
        $lineHeight={42}
        $fontWeight="lighter"
    >
        {children}
    </ComponentBase>
);

const H3: React.FC<TextImplementProps> = ({
    shade, state, children
}): React.ReactElement => (
    <ComponentBase 
        as={'h3'} 
        $shade={shade} 
        $state={state}
        $fontSize={30}
        $lineHeight={36}
        $fontWeight="lighter"
    >
        {children}
    </ComponentBase>
);

const H4: React.FC<TextImplementProps> = ({
    shade, state, children
}): React.ReactElement => (
    <ComponentBase 
        as={'h4'} 
        $shade={shade} 
        $state={state}
        $fontSize={20}
        $lineHeight={24}
        $fontWeight="bold"
    >
        {children}
    </ComponentBase>
);

const H5: React.FC<TextImplementProps> = ({
    shade, state, children
}): React.ReactElement => (
    <ComponentBase 
        as={'h5'} 
        $shade={shade} 
        $state={state}
        $fontSize={18}
        $lineHeight={24}
        $fontWeight="normal"
    >
        {children}
    </ComponentBase>
);

const H6: React.FC<TextImplementProps> = ({
    shade, state, children
}): React.ReactElement => (
    <ComponentBase 
        as={'h6'} 
        $shade={shade} 
        $state={state}
        $fontSize={15}
        $lineHeight={20}
        $fontWeight="bold"
    >
        {children}
    </ComponentBase>
);

const Body1: React.FC<TextImplementProps> = ({
    shade, state, children
}): React.ReactElement => (
    <ComponentBase
        $shade={shade} 
        $state={state}
        $fontSize={20}
        $lineHeight={24}
        $fontWeight="normal"
    >
        {children}
    </ComponentBase>
);

const Body2: React.FC<TextImplementProps> = ({
    shade, state, children
}): React.ReactElement => (
    <ComponentBase
        $shade={shade} 
        $state={state}
        $fontSize={15}
        $lineHeight={20}
        $fontWeight="normal"
    >
        {children}
    </ComponentBase>
);

const Caption: React.FC<TextImplementProps> = ({
    shade, state, children
}): React.ReactElement => (
    <ComponentBase
        $shade={shade} 
        $state={state}
        $fontSize={12}
        $lineHeight={16}
        $fontWeight="normal"
    >
        {children}
    </ComponentBase>
);

export {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    Body1,
    Body2,
    Caption
};