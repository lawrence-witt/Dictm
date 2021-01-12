import React from 'react';

import * as AppBar from '../base/bars/AppBar';
import IconButton from '../base/buttons/IconButton';
import Typography from '../base/misc/Typography';

import MenuIcon from '../base/icons/MenuIcon';
import RepeatIcon from '../base/icons/RepeatIcon';
import SearchIcon from '../base/icons/SearchIcon';
import TrashIcon from '../base/icons/TrashIcon';

const CompAppBar: React.FC = (): React.ReactElement => {
    return (
        <AppBar.Base>
            <AppBar.End>
                <IconButton 
                    jsx={MenuIcon} 
                    shade="light" 
                    state="focussed" 
                />
            </AppBar.End>
            <AppBar.Centre>
                <Typography 
                    variant="h4" 
                    shade="light" 
                    state="focussed"
                >
                    Recordings
                </Typography>
            </AppBar.Centre>
            <AppBar.End>
                <IconButton 
                    jsx={RepeatIcon} 
                    shade="light" 
                    state="enabled"
                />
                <IconButton
                    jsx={SearchIcon} 
                    shade="light" 
                    state="enabled"
                />
                <IconButton
                    jsx={TrashIcon} 
                    shade="light" 
                    state="enabled"
                />
            </AppBar.End>
        </AppBar.Base>
    );
};

export default CompAppBar;