import { SafeVhTypes } from './SafeVh.types';

const mqo = () => matchMedia("(orientation: portrait)").matches ? "portrait-primary" : "landscape-primary";

export const getOrientationType = (): OrientationType => {
    return (o => o ? o.type : undefined)(screen.orientation) || mqo();
}

export const isPortaitTouchDevice = (): boolean => {
    const isPortraitDevice = (ot => ot === "portrait-primary" || ot === "landscape-secondary")(getOrientationType());
    const isTouchDevice = matchMedia("(pointer: coarse)").matches;
    return isPortraitDevice && isTouchDevice;
}

export const getFixedVh = () => `${window.innerHeight / 100}px` as const;

export const getSafeVh = (): SafeVhTypes => isPortaitTouchDevice() ? getFixedVh() : '1vh';