import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { contentSelectors } from '../../../redux/ducks/content';
import { editorOperations } from '../../../redux/ducks/editor';

export interface InjectedContentGridProps {
    context: "recordings" | "notes" | "categories";
    categoryId?: string;
}

const mapState = (state: RootState, props: InjectedContentGridProps) => ({
    contentList: contentSelectors.getContentList(
        state.content,
        state.user.profile,
        props,
        state.tools.search.term
    )
});

const mapDispatch = {
    openEditor: editorOperations.openEditor
}

export const connector = connect(mapState, mapDispatch);

export type ConnectedContentGridProps = ConnectedProps<typeof connector>;

export type ContentGridProps = ConnectedContentGridProps & InjectedContentGridProps;