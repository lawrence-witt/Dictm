import React from 'react';

import { SafeVhTypes, SafeVhProps } from './SafeVh.types';
import { getOrientationType, isPortaitTouchDevice, getFixedVh, getSafeVh } from './SafeVh.utils';

const SafeVhContext = React.createContext<SafeVhTypes | null>(null);

/** 
*  Summary: 
*  Injects a mobile friendly alternative to vh units into the document/application.
*
*  Description:
*  Many mobile browsers implement variable UIs which cause jagged reflows 
*  of vh sized content when they retract. This component creates a CSS variable
*  and React Context which tracks window height on mobile browsers.
*/

const SafeVh: React.FC<SafeVhProps> = (props) => {
    const {  
        inject,
        children
    } = props;

    const [safeVh, setSafeVh] = React.useState<SafeVhTypes>(getSafeVh());

    React.useLayoutEffect(() => {
        const rootStyle = document.documentElement.style;

        let currentWidth = window.innerWidth;
        let currentOrientationType = getOrientationType();

        const updateRoot = (value: SafeVhTypes) => inject && rootStyle.setProperty("--safe-vh", value);
        const updateState = (value: SafeVhTypes) => setSafeVh(value);

        const checkResize = () => {
            if (currentWidth === window.innerWidth) return;
            
            const newOrientationType = getOrientationType();

            if (newOrientationType !== currentOrientationType) {
                currentWidth = window.innerWidth;
                currentOrientationType = newOrientationType;

                const newFixedVh = getFixedVh();

                updateRoot(newFixedVh);
                updateState(newFixedVh);
                return;
            }

            // Reset back to 100vh on a valid width resize

            updateRoot('1vh');
            updateState('1vh');

            window.removeEventListener("resize", checkResize);
        }

        updateRoot(getSafeVh());

        if (isPortaitTouchDevice()) window.addEventListener('resize', checkResize);
        
        return () => window.removeEventListener('resize', checkResize);
    }, [inject]);

    return (
        <SafeVhContext.Provider value={safeVh}>
            {children}
        </SafeVhContext.Provider>
    )
}

export const useSafeVh = (): SafeVhTypes => {
    const context = React.useContext(SafeVhContext);
    if (!context) throw new Error('useSafeVh was called without a parent provider.');
    return context;
}

export default SafeVh;