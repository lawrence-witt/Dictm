import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import AppBar from '../../organisms/AppBar/AppBar';
import NavBar from '../../organisms/NavBar/NavBar';
import NavMenu from '../../organisms/NavMenu/NavMenu';
import Editor from '../../organisms/Editor/Editor';
import DashboardSwitch from './switch/DashboardSwitch';

const useStyles = makeStyles(() => ({
    fixedBase: {
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'fixed'
    },
    pageBase: {
        height: '100%',
        width: '100%',
        minWidth: 300,
        display: 'flex',
        flexDirection: 'column'
    }
}));

const Dashboard: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.fixedBase}>
            <NavMenu/>
            <div className={classes.pageBase}>
                <AppBar/>
                <DashboardSwitch />
                <Editor />
                <NavBar />
            </div>
        </div>
    )
}

export default Dashboard;