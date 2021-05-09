import React from 'react';
import { useHistory } from 'react-router-dom';

import Edit from '@material-ui/icons/Edit';

import CardBase, { CardBasePrimaryRow, CardBaseActionSwitch } from '../CardBase';

import * as types from './CategoryCard.types';

const CategoryCard: React.FC<types.CategoryCardProps> = (props) => {
    const {
        id,
        title,
        isSecondaryActive,
        isSecondarySelected,
        inert,
        onToggleDelete,
        openEditor
    } = props;

    const history = useHistory();

    const onCardClick = React.useCallback(() => {
        history.push("/categories/"+id);
    }, [history, id]);

    const onPrimaryAction = React.useCallback(() => {
        openEditor("category", id);
    }, [openEditor, id]);

    const onSecondaryAction = React.useCallback(() => {
        onToggleDelete("category", id);
    }, [onToggleDelete, id]);

    return (
        <CardBase
            onCardClick={onCardClick}
            isSecondaryActive={isSecondaryActive}
            inert={inert}
        >
            <CardBasePrimaryRow
                title={title}
            >
                <CardBaseActionSwitch 
                    primaryIcon={Edit}
                    onPrimaryAction={onPrimaryAction}
                    onSecondaryAction={onSecondaryAction}
                    isSecondaryActive={isSecondaryActive}
                    isSecondarySelected={isSecondarySelected}
                    inert={inert}
                />
            </CardBasePrimaryRow>
        </CardBase>
    )
}

export default CategoryCard;