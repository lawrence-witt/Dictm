const makeRgba = (vals: number[]) => `rgba(${vals.join(', ')})`;
const makePrimary = (o: number) => makeRgba([98, 0, 238, o]);
const makeSecondary = (o: number) => makeRgba([3, 218, 197, o]);
const makeLight = (o: number) => makeRgba([255, 255, 255, o]);
const makeDark = (o: number) => makeRgba([0, 0, 0, o]); 

interface MainColor {
    main: string;
    variant: string;
}

interface StateColor {
    activated: string;
    enabled: string;
    focussed: string;
    disabled: string;
    hovered: string;
}

export interface IThemeObject {
    color: {
        primary: MainColor;
        secondary: MainColor;
        states: {
            light: StateColor;
            dark: StateColor;
        }
    }
}

export default {
    color: {
        primary: {
            main: makePrimary(1),
            variant: makePrimary(0.24)
        },
        secondary: {
            main: makeSecondary(1),
            variant: makeSecondary(0.24)
        },
        states: {
            light: {
                activated: makeLight(1),
                enabled: makeLight(0.76),
                focussed: makeLight(0.54),
                disabled: makeLight(0.34),
                hovered: makeLight(0.12)
            },
            dark: {
                activated: makeDark(0.84),
                enabled: makeDark(0.54),
                focussed: makeDark(0.44),
                disabled: makeDark(0.24),
                hovered: makeDark(0.12)
            }
        }
    }
}