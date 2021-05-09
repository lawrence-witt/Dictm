import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../redux/store';
import { editorOperations } from '../../../../redux/ducks/editor';
import { toolOperations, toolSelectors } from '../../../../redux/ducks/tools';

interface InjectedCategoryCardProps {
    title: string;
    id: string;
}

const mapState = (state: RootState, props: InjectedCategoryCardProps) => ({
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

export const connector = connect(mapState, mapDispatch);

type ConnectedCategoryCardProps = ConnectedProps<typeof connector>;

export type CategoryCardProps = InjectedCategoryCardProps & ConnectedCategoryCardProps;