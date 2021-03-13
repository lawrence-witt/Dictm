import {
    CassetteStatus,
    CassettePublicFlags
} from 'cassette-js'

export interface ControlsProps {
    mode: 'play' | 'edit';
    status: CassetteStatus;
    flags: CassettePublicFlags;
    handleStart: (type: 'record' | 'play') => Promise<void>;
    handleStop: () => Promise<void>;
    handleScan: (type: 'to' | 'by', secs: number) => Promise<void>;
    handleSave: () => Promise<void>;
    handleTimeout: (type: 'set' | 'clear') => void;
}