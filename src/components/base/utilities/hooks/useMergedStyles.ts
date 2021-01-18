import * as React from 'react';

import deeplyMergePrimitiveObjects from '../functions/deeplyMergePrimitiveObjects';

const useMergedStyles = (
    defaultStyle = {}, customStyle = {}
): any => {
    return React.useMemo(() => {
        return deeplyMergePrimitiveObjects(defaultStyle, customStyle);
    }, [defaultStyle, customStyle]);
};

export default useMergedStyles;