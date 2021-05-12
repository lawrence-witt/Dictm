import React from 'react';
import isEqual from 'react-fast-compare';

import NoteEditorButtons from './NoteEditorButtons';
import { connector } from './NoteEditorButtons.types';

export default connector(React.memo(NoteEditorButtons, (prev, next) => isEqual(prev, next)));