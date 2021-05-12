import React from 'react';

import CategoryCard from './CategoryCard';
import { connector } from './CategoryCard.types';

export default React.memo(connector(CategoryCard));

export { CategoryCard as _CategoryCard };