import React from 'react';
import Measure, { BoundingRect } from 'react-measure';

import * as types from './MasonryGrid.types';

const smallestOf = (a: number, b: number) => a < b ? a : b;

const getColumns = (
    width: number, 
    repeat: types.RepeatType, 
    min: number, 
    max: types.MinMax,
    childCount: number
) => {
    let length: number;

    if (repeat === 'auto-fill') {
        length = Math.floor(width/min) || 1;
    } else {
        length = smallestOf(Math.floor(width/min), childCount) || 1;
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

const Masonry: React.FC<types.MasonryGridProps> = (props) => {
    const {
        repeat = 'auto-fit',
        min = 300,
        max = '1fr',
        gridClass,
        columnClass,
        children
    } = props;

    const gridClassName = gridClass || 'rpt-masonry-grid';
    const colClassName = columnClass || 'rpt-masonry-col';

    const [state, setState] = React.useState<types.MasonryGridState>({
        width: undefined,
        columns: [],
        minWidth: undefined,
        maxWidth: undefined
    });

    // react-measure callback

    const childCount = React.Children.count(children);

    const onResize = React.useCallback((content: { bounds: BoundingRect }) => {
        const { width } = content.bounds;
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
    
    // memoised column calculation

    const assignedColumns = React.useMemo(() => {
        const { width, columns, maxWidth, minWidth } = state;

        if (width === undefined) return null;

        const _columns = columns.slice(0);

        React.Children.toArray(children).forEach((child, i) => {
            const colIndex = i % _columns.length;
            _columns[colIndex] = [..._columns[colIndex], child];
        });

        return _columns.map((col, i) => (
            <div 
                key={i} 
                className={colClassName} 
                style={{maxWidth, minWidth}
            }>
                {col && col}
            </div>
        ));
    }, [children, state, colClassName]);

    return (
        <Measure
            bounds
            onResize={onResize}
        >
            {({measureRef}) => (
                <div ref={measureRef} className={gridClassName}>
                    {assignedColumns}
                </div>
            )}
        </Measure>
    )
};

export default Masonry;