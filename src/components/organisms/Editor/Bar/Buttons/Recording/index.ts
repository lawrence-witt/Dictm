import React from 'react';

import RecordingEditorButtons from './RecordingEditorButtons';
import { connector } from './RecordingEditorButtons.types';

export default connector(React.memo(RecordingEditorButtons, (prev, next) => {
    if (prev.openDetailsDialog !== next.openDetailsDialog) return false;
    if (prev.updateMode !== next.updateMode) return false;
    if (prev.model.data.audio.data.bytes.length !== next.model.data.audio.data.bytes.length) return false;

    return true;
}));