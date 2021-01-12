import React from 'react';

import * as TabBar from '../base/bars/TabBar';

import RecordIcon from '../base/icons/AlbumIcon';
import NoteIcon from '../base/icons/NoteIcon';
import CategoryIcon from '../base/icons/CategoryIcon';

const CompTabBar: React.FC = (): React.ReactElement => {
    return (
        <TabBar.Base>
            <TabBar.Tab 
                jsx={RecordIcon} 
                label="Recordings"
                shade="light"
                state="focussed"
            />
            <TabBar.Tab
                jsx={NoteIcon}
                label="Notes"
                shade="light"
                state="enabled"
            />
            <TabBar.Tab 
                jsx={CategoryIcon}
                label="Categories"
                shade="light"
                state="enabled"
            />
        </TabBar.Base>
    )
};

export default CompTabBar;