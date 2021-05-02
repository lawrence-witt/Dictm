import React from 'react';

const useAsRef = <V extends unknown>(value: V): Readonly<React.MutableRefObject<V>> => {
    const valueRef = React.useRef<typeof value>(value);

    React.useEffect(() => { valueRef.current = value }, [value]);

    return valueRef;
}

export default useAsRef;