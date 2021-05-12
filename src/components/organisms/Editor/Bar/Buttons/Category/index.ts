import React from 'react';
import isEqual from 'react-fast-compare';

import CategoryEditorButtons from './CategoryEditorButtons';
import { connector } from './CategoryEditorButtons.types';

export default connector(React.memo(CategoryEditorButtons, (prev, next) => isEqual(prev, next)));