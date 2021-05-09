import React from 'react';

import * as types from './KeyControl.types';

const KeyControl = <K extends string[]>(
    props: React.PropsWithChildren<types.KeyControlProps<K>>
): JSX.Element | null => {
    const {
        className,
        children
    } = props;

    const [key, setKey] = React.useState<[...K][number] | undefined>();

    if (typeof children !== "function") return null;

    return (
        <div className={className}>
            {children(key, setKey)}
        </div>
    );
}

export default KeyControl;