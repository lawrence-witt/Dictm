import React, { useMemo } from 'react';

import deeplyMergePrimitiveObjects from '../functions/deeplyMergePrimitiveObjects';

const useMergedStyles = (
    defaultStyle = {}, customStyle = {}
): React.CSSProperties => {
    return useMemo(() => {
        return deeplyMergePrimitiveObjects(defaultStyle, customStyle);
    }, [defaultStyle, customStyle]);
};

export default useMergedStyles;