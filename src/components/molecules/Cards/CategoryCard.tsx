import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { editorOperations } from '../../../redux/ducks/editor';

import Edit from '@material-ui/icons/Edit';

import CardBase, { CardBasePrimaryRow, CardBaseActionSwitch } from './CardBase';

interface CategoryCardProps {
    title: string;
    id: string;
}

/* 
*   Redux
*/

const mapDispatch = {
    openEditor: editorOperations.openEditor
}

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const CategoryCard: React.FC<CategoryCardProps & ReduxProps> = (props) => {
    const {
        id,
        title,
        openEditor
    } = props;

    const history = useHistory();

    const onCardClick = React.useCallback(() => {
        history.push("/categories/"+id);
    }, [history, id]);

    const onPrimaryAction = React.useCallback(() => {
        openEditor("category", id);
    }, [openEditor, id]);

    return (
        <CardBase
            onCardClick={onCardClick}
        >
            <CardBasePrimaryRow
                title={title}
            >
                <CardBaseActionSwitch 
                    primaryIcon={Edit}
                    onPrimaryAction={onPrimaryAction}
                    isSecondaryActive={false}
                    isSecondarySelected={false}
                />
            </CardBasePrimaryRow>
        </CardBase>
    )
}

export default connector(CategoryCard);