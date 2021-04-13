/* import React from 'react';
import { CassetteUserParams, CassettePublicMethods, CassetteStatus, CassettePublicFlags } from 'cassette-js';

import useCassette, { CassetteGetters } from '../hooks/useCassette';

interface StampContext {
    progress: number;
    duration: number;
}

interface StatusContext {
    status: CassetteStatus;
    flags: CassettePublicFlags;
}

const CassetteControlsContext = React.createContext<CassettePublicMethods | null>(null);
const CassetteStampContext = React.createContext<StampContext | null>(null);
const CassetteStatusContext = React.createContext<StatusContext | null>(null);
const CassetteGetterContext = React.createContext<CassetteGetters | null>(null);
const CassetteErrorContext = React.createContext<unknown>(null);

const useCassetteControls = (): CassettePublicMethods => React.useContext(CassetteControlsContext) as CassettePublicMethods;
const useCassetteStamps = (): StampContext => React.useContext(CassetteStampContext) as StampContext;
const useCassetteStatus = (): StatusContext => React.useContext(CassetteStatusContext) as StatusContext;
const useCassetteGetters = (): CassetteGetters => React.useContext(CassetteGetterContext) as CassetteGetters;
const useCassetteError = (): unknown => React.useContext(CassetteErrorContext);

const CassetteProvider: React.FC<CassetteUserParams> = ({
    increment, floorOutput, onProgress, onStatus, onError, children
}) => {
    const cassette = useCassette(increment, floorOutput, onProgress, onStatus, onError);

    const stampContext = React.useMemo(() => ({
        progress: cassette.progress,
        duration: cassette.duration
    }), [cassette.progress, cassette.duration]);

    const statusContext = React.useMemo(() => ({
        status: cassette.status,
        flags: cassette.flags
    }), [cassette.status, cassette.flags]);

    return (
        <CassetteControlsContext.Provider value={cassette.controls}>
            <CassetteStampContext.Provider value={stampContext}>
                <CassetteStatusContext.Provider value={statusContext}>
                    <CassetteGetterContext.Provider value={cassette.get}>
                        <CassetteErrorContext.Provider value={cassette.error}>
                            {children}
                        </CassetteErrorContext.Provider>
                    </CassetteGetterContext.Provider>
                </CassetteStatusContext.Provider>
            </CassetteStampContext.Provider>
        </CassetteControlsContext.Provider>
    )
};

export default CassetteProvider;
export { useCassetteControls, useCassetteStamps, useCassetteStatus, useCassetteGetters, useCassetteError }; */