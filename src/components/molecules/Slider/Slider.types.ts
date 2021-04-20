import React from "react";

type Directions = 'top' | 'left' | 'bottom' | 'right';

export interface SliderProps<
    I extends {[key: string]: any}
> {
    item: {
        key: keyof I;
        object: I
    };
    children: (item: I) => React.ReactNode;
    classes?: {
        root?: string;
        frame?: string;
    };
    disabled?: boolean;
    enter?: Directions;
    exit?: Directions;
}