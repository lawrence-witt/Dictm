import React from 'react';
import Measure from 'react-measure';

// Types

type MinMax = number | '1fr';
type RepeatType = 'auto-fill' | 'auto-fit';

interface MasonryGridProps {
    repeat?: RepeatType;
    min?: number;
    max?: MinMax;
    gridStyle?: React.CSSProperties;
    columnStyle?: React.CSSProperties;
}

// Styles

const defaultGridStyle: React.CSSProperties  = { 
    display: 'flex',
    height: '100%',
    width: '100%'
}

const defaultColumnStyle: React.CSSProperties = {
    height: '100%',
    width: '100%'
}

// Helpers

const smallestOf = (a: number, b: number) => a < b ? a : b;

const getColumns = (
    width: number, 
    repeat: RepeatType, 
    min: number, 
    max: MinMax,
    childCount: number
) => {
    let length: number;

    if (repeat === 'auto-fill') {
        length = Math.floor(width/min); 
    } else if (repeat === 'auto-fit') {
        length = smallestOf(Math.floor(width/min), childCount);
    }

    if (max !== '1fr') length = Math.floor(width/max) || 1;

    const maxWidth = max === '1fr' ? 'default' : max;
    const minWidth = length === 1 ? min : 0;

    return {
        columns: Array.from({length}, () => []),
        maxWidth,
        minWidth
    }
}

// Component

const Masonry: React.FC<MasonryGridProps> = (props) => {
    const {
        repeat = 'auto-fit',
        min = 250,
        max = '1fr',
        gridStyle = {},
        columnStyle = {},
        children
    } = props;

    const [state, setState] = React.useState({
        width: undefined,
        columns: [],
        minWidth: undefined,
        maxWidth: undefined
    });

    const gsMemo = React.useMemo(() => (
        Object.assign({}, defaultGridStyle, gridStyle)
    ), [gridStyle]);

    const csMemo = React.useMemo(() => (
        Object.assign({}, defaultColumnStyle, columnStyle)
    ), [columnStyle]);

    const childCount = React.Children.count(children);

    const onResize = React.useCallback(({bounds}) => {
        const { width } = bounds;
        setState(s => {
            const { 
                columns: pCols,
                minWidth: pMinW, 
                maxWidth: pMaxW 
            } = s;

            const { columns, maxWidth, minWidth } = getColumns(
                width, repeat, min, max, childCount
            );

            if (
                columns.length === pCols.length && 
                minWidth === pMinW &&
                maxWidth === pMaxW
            ) return s;

            return { width, columns, minWidth, maxWidth};
        });
    }, [repeat, min, max, childCount]);

    const AssignedColumns = React.useMemo(() => {
        const { width, columns, maxWidth, minWidth } = state;

        if (width === undefined) return null;

        const _columns = columns.slice(0);

        React.Children.toArray(children).forEach((child, i) => {
            const colIndex = i % _columns.length;
            _columns[colIndex] = [..._columns[colIndex], child];
        });

        const limitColumnStyle = Object.assign({}, csMemo, { maxWidth, minWidth });

        return _columns.map((col, i) => (
            <div key={i} className="masonry-column" style={limitColumnStyle}>
                {col && col}
            </div>
        ));
    }, [children, state, csMemo]);

    return (
        <Measure
            bounds
            onResize={onResize}
        >
            {({measureRef}) => (
                <div ref={measureRef} className="masonry-grid" style={gsMemo}>
                    {AssignedColumns}
                </div>
            )}
        </Measure>
    )
};

export default Masonry;