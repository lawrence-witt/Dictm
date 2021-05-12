import React from 'react';
import isEqual from 'react-fast-compare';

import NoteCard from './NoteCard';
import { connector } from './NoteCard.types';

export default React.memo(connector(NoteCard), (prev, next) => isEqual(prev, next));

export { NoteCard as _NoteCard };