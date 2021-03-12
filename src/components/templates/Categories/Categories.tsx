import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../redux/store';

import CardGrid from '../../molecules/Grids/CardGrid';
import CategoryCard from '../../molecules/Cards/CategoryCard';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    categories: state.categories
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const CategoriesTemplate: React.FC<ReduxProps> = (props) => {
    const {
        categories
    } = props;

    const history = useHistory();

    const onFabClick = () => {
        const base = history.location.pathname;

        history.push(`${base}?edit=category&id=new`);
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
                        title={category.title}
                    />
                )
            })}
        </CardGrid>
    )
}

export default connector(CategoriesTemplate);