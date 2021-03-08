import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useFrameStyles = makeStyles({
    editorFrame: {
        position: 'relative',
        height: '100%',
        width: '100%'
    }
})


const EditorFrame: React.FC = (props) => {
    const { 
        children 
    } = props;

    const classes = useFrameStyles();

    return (
        <Box className={classes.editorFrame}>
            {children}
        </Box>
    )
}

export default EditorFrame;