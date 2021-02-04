import React from 'react';

import useCassette from '../hooks/useCassette';
import { hookTypes } from '../hooks/useCassette'

const StatusContext = React.createContext(null);
const useStatus = (): hookTypes.CassetteStatus => React.useContext(StatusContext);
const TapeContext = React.createContext(null);
const useTape = (): hookTypes.CassetteTape => React.useContext(TapeContext);
const EncodedContext = React.createContext(null);
const useEncoded = (): hookTypes.CassetteEncoded => React.useContext(EncodedContext);
const ControlsContext = React.createContext(null);
const useControls = (): hookTypes.CassetteControls => React.useContext(ControlsContext);

const CassetteProvider: React.FC = ({children}) => {
    const {
        status,
        tape,
        encoded,
        controls
    } = useCassette();

    React.useEffect(() => {
        controls.connect();
    }, [controls]);

    return (
        <StatusContext.Provider value={status}>
            <TapeContext.Provider value={tape}>
                <EncodedContext.Provider value={encoded}>
                    <ControlsContext.Provider value={controls}>
                        {children}
                    </ControlsContext.Provider>
                </EncodedContext.Provider>
            </TapeContext.Provider>
        </StatusContext.Provider>
    )
};

export { useStatus, useTape, useEncoded, useControls };
export default CassetteProvider;