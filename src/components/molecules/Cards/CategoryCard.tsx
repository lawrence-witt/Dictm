import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { editorOperations } from '../../../redux/ducks/editor';
import { toolOperations, toolSelectors } from '../../../redux/ducks/tools';

import Edit from '@material-ui/icons/Edit';

import CardBase, { CardBasePrimaryRow, CardBaseActionSwitch } from './CardBase';

interface CategoryCardProps {
    title: string;
    id: string;
}

/* 
*   Redux
*/

const mapState = (state: RootState, props: CategoryCardProps) => ({
    isSecondaryActive: state.tools.delete.isOpen,
    isSecondarySelected: toolSelectors.getDeleteToggledStatus(
        state.tools.delete,
        "categories",
        props.id
    )
});

const mapDispatch = {
    openEditor: editorOperations.openEditor,
    onToggleDelete: toolOperations.toggleDeleteResource
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const CategoryCard: React.FC<CategoryCardProps & ReduxProps> = (props) => {
    const {
        id,
        title,
        isSecondaryActive,
        isSecondarySelected,
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
                />
            </CardBasePrimaryRow>
        </CardBase>
    )
}

export default connector(CategoryCard);