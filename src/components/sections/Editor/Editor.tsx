import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../redux/store';
import { editorOperations } from '../../../redux/ducks/editor';

import FocusDrawer from '../../molecules/Drawers/FocusDrawer';
import EditorLayout from './Layout/Layout';

import Dialog from './Dialog/Dialog';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    editor: state.editor
});

const mapDispatch = {
    closeEditor: editorOperations.closeEditor,
    clearEditor: editorOperations.clearEditor
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const Editor: React.FC<ReduxProps> = (props) => {
    const {
        editor,
        closeEditor,
        clearEditor
    } = props;

    // Editor visibility control

    const [editorOpen, setEditorOpen] = React.useState(editor.attributes.isOpen);

    React.useEffect(() => {
        setEditorOpen(editor.attributes.isOpen);
    }, [editor.attributes.isOpen]);

    // Handle editor close

    const onRequestEditorClosed = React.useCallback(() => {
        closeEditor();
    }, [closeEditor]);

    return (
        <FocusDrawer
            open={editorOpen}
            onClose={onRequestEditorClosed}
            SlideProps={{
                mountOnEnter: true,
                unmountOnExit: true,
                onExited: clearEditor
            }}
        >
            {editor.context && (
                <>
                    <EditorLayout
                        attributes={editor.attributes}
                        context={editor.context}
                    />
                    <Dialog 
                        open={false}
                        schema={{
                            type: 'save',
                            props: {
                                contentType: 'recording',
                                newContent: false
                            }
                        }}
                    />
                </>
            )}
        </FocusDrawer>
    )
};

export default connector(Editor);