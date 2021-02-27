import React from 'react';
import { CassetteUserParams } from 'cassette-js';

import useCassette from '../hooks/useCassette';

interface CassetteProviderProps {
    clockOptions?: CassetteUserParams["clockOptions"];
    analyserOptions?: CassetteUserParams["analyserOptions"];
    onProgress?: CassetteUserParams["onProgress"];
    onStatus?: CassetteUserParams["onStatus"];
    onAnalysis?: CassetteUserParams["onAnalysis"];
    onError?: CassetteUserParams["onError"];
}

const CassetteControlsContext = React.createContext(null);
const CassetteStampContext = React.createContext(null);
const CassetteStatusContext = React.createContext(null);
const CassetteAnalysisContext = React.createContext(null);
const CassetteErrorContext = React.createContext(null);

const useCassetteControls = () => React.useContext(CassetteControlsContext);
const useCassetteStamps = (): { progress: number, duration: number } => React.useContext(CassetteStampContext);
const useCassetteStatus = () => React.useContext(CassetteStatusContext);
const useCassetteAnalysis = () => React.useContext(CassetteAnalysisContext);
const useCassetteError = () => React.useContext(CassetteErrorContext);

const CassetteProvider: React.FC<CassetteProviderProps> = ({
    clockOptions, analyserOptions, onProgress, onStatus, onAnalysis, onError, children
}) => {

    const cassette = useCassette(clockOptions, analyserOptions, onProgress, onStatus, onAnalysis, onError);

    const stampContext = React.useMemo(() => ({
        progress: cassette.progress,
        duration: cassette.duration
    }), [cassette.progress, cassette.duration]);

    const statusContext = React.useMemo(() => ({
        status: cassette.status,
        flags: cassette.flags
    }), [cassette.status, cassette.flags]);

    const analysisContext = React.useMemo(() => ({
        analyser: cassette.analyser,
        analysis: cassette.analysis
    }), [cassette.analyser, cassette.analysis]);

    return (
        <CassetteControlsContext.Provider value={cassette.controls}>
            <CassetteStampContext.Provider value={stampContext}>
                <CassetteStatusContext.Provider value={statusContext}>
                    <CassetteAnalysisContext.Provider value={analysisContext}>
                        <CassetteErrorContext.Provider value={cassette.error}>
                            {children}
                        </CassetteErrorContext.Provider>
                    </CassetteAnalysisContext.Provider>
                </CassetteStatusContext.Provider>
            </CassetteStampContext.Provider>
        </CassetteControlsContext.Provider>
    )
};

export default CassetteProvider;
export { useCassetteControls, useCassetteStamps, useCassetteStatus, useCassetteAnalysis, useCassetteError };