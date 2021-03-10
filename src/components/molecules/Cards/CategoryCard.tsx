import React from 'react';
import Edit from '@material-ui/icons/Edit';
import CardBase, { CardBasePrimaryRow, CardBaseActionSwitch } from './CardBase';

const CategoryCard: React.FC = () => {
    return (
        <CardBase>
            <CardBasePrimaryRow
                title="Category"
            >
                <CardBaseActionSwitch 
                    primaryIcon={Edit}
                    isSecondaryActive={false}
                    isSecondarySelected={false}
                />
            </CardBasePrimaryRow>
        </CardBase>
    )
}

export default CategoryCard;