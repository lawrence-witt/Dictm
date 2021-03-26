import React from 'react';
import Edit from '@material-ui/icons/Edit';
import CardBase, { CardBasePrimaryRow, CardBaseActionSwitch } from './CardBase';

interface CategoryCardProps {
    title: string;
    onCardClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = (props) => {
    const {
        title,
        onCardClick
    } = props;

    return (
        <CardBase
            onCardClick={() => console.log('navigate to category')}
        >
            <CardBasePrimaryRow
                title={title}
            >
                <CardBaseActionSwitch 
                    primaryIcon={Edit}
                    onPrimaryAction={onCardClick}
                    isSecondaryActive={false}
                    isSecondarySelected={false}
                />
            </CardBasePrimaryRow>
        </CardBase>
    )
}

export default CategoryCard;