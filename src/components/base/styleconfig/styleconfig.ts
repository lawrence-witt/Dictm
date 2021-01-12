import { ContentColors, ContentShade, ContentState } from './styleconfig.d';

// Types

interface ContentScheme {
    color: ContentColors;
    states: {
        [key in ContentState]: number;
    }
}

// Content

const contentConfig = (
    shade: ContentShade = 'dark', 
    state: ContentState = 'focussed'
): {
    color: string;
    opacity: number;
} => {
    
    const schema: {[key in ContentShade]: ContentScheme} = {
        light: {
            color: '#FFFFFF',
            states: { focussed: 1, enabled: 0.76, disabled: 0.34 }
        },
        dark: {
            color: '#000000',
            states: { focussed: 0.87, enabled: 0.54, disabled: 0.12 }
        }
    };

    return {
        color: schema[shade].color,
        opacity: schema[shade].states[state]
    };
};

export { contentConfig };