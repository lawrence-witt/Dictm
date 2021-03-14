import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { editorOperations } from '../../../redux/ducks/editor';

import CardGrid from '../../molecules/Grids/CardGrid';
import CategoryCard from '../../molecules/Cards/CategoryCard';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    categories: state.categories
});

const mapDispatch = {
    openEditor: editorOperations.openEditor
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const CategoriesTemplate: React.FC<ReduxProps> = (props) => {
    const {
        categories,
        openEditor
    } = props;

    const onCardClick = (id: string) => {
        openEditor("category", id);
    }

    const onFabClick = () => {
        openEditor("category", "new");
    }

    return (
        <CardGrid
            onFabClick={onFabClick}
        >
            {categories.allIds.map(id => {
                const category = categories.byId[id];

                return (
                    <CategoryCard
                        key={category.id}
                        title={category.attributes.title}
                        onCardClick={() => onCardClick(category.id)}
                    />
                )
            })}
        </CardGrid>
    )
}

export default connector(CategoriesTemplate);