import React from 'react';
import { useTransition } from 'react-spring';

import EditorBar from './Bar/EditorBar';
import EditorFrame from './Frame/EditorFrame';
import EditorContent from './Content/EditorContent';

import { EditorLayoutProps } from './Layout.types';

const EditorLayout: React.FC<EditorLayoutProps> = (props) => {
    const {
        panel,
        className
    } = props;

    const { title, Buttons } = panel;

    const panelTransition = useTransition(panel, {
        key: panel.type,
        initial: { transform: 'translateX(0%)' },
        from: { transform: 'translateX(100%)'},
        enter: { transform: 'translateX(0%)'},
        leave: { transform: 'translateX(-100%)'}
    });

    return (
        <>
            <EditorBar title={title}>
                {Buttons && <Buttons />}
            </EditorBar>
            <EditorFrame>
                {panelTransition((style, item) => {
                    const { disableGutters, component, Content } = item;

                    return (
                        <EditorContent
                            springStyle={style} 
                            component={component as React.ElementType}
                            disableGutters={disableGutters}
                            className={className}
                        >
                            <Content />
                        </EditorContent>
                    )
                })}
            </EditorFrame>
        </>
    )
}

export default EditorLayout;