import React from 'react';

import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';

const SaveButton: React.FC<IconButtonProps> = (props) => {
    return (
        <IconButton {...props}>
            <SaveIcon />
        </IconButton>
    )
}

export default SaveButton;