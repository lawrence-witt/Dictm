import React from 'react';

import { ParamOptions } from '../commonTypes';
import AudioManager from '../manager/AudioManager'; 

function optionsDifferent(prevOptions: ParamOptions, newOptions: ParamOptions) {
    const prevKeys = Object.keys(prevOptions);
    const newKeys = Object.keys(newOptions);

    if (prevKeys.length !== newKeys.length) return true;

    const isDifferent = newKeys.some(key => {
        if (!prevKeys.includes(key)) return true;
        if (key === 'analyserOptions') {
            return optionsDifferent(prevOptions[key], newOptions[key]);
        } else {
            return newOptions[key] !== prevOptions[key];
        }
    });

    return isDifferent;
}

function useOptionsControl(
    stamp: React.MutableRefObject<number>,
    Manager: React.MutableRefObject<any>,
    options: ParamOptions
): void {
    const prevOptions = React.useRef(options);

    React.useEffect(() => {
        if (!Manager.current) {
            Manager.current = new AudioManager(stamp.current, options);
        } else if (optionsDifferent(prevOptions.current, options)) {
            prevOptions.current = options;

            Manager.current.unlink();
            stamp.current = Date.now();
            Manager.current = new AudioManager(stamp.current, options);
        }
    }, [stamp, Manager, options]);

    React.useEffect(() => {
        return () => Manager.current.unlink();
    }, [Manager]);
}

export default useOptionsControl;