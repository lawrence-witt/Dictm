import React from 'react';

import RecordingCard from './RecordingCard';
import { connector } from './RecordingCard.types';

export default connector(React.memo(RecordingCard));

export { RecordingCard as _RecordingCard };