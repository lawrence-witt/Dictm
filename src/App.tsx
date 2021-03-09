import React from 'react';
import { hot } from 'react-hot-loader';

import { makeStyles } from '@material-ui/core/styles';

import ToolBar from './components/DashBoard/ToolBar/ToolBar';
import NavBar from './components/DashBoard/NavBar';
import NavMenu from './components/DashBoard/NavMenu/NavMenu';
import RecordingCard from './components/Cards/RecordingCard';
import NoteCard from './components/Cards/NoteCard';
import CategoryCard from './components/Cards/CategoryCard';
import Editor from './components/Editor/Editor';

import useToggle from './utils/hooks/useToggle';
import CardGrid from './components/Layout/CardGrid';

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

const App: React.FC = (): React.ReactElement => {
    const classes = useStyles();

    const [num] = React.useState(new Array(10).fill(1));
    const [isMenuOpen, toggleMenu] = useToggle(false);

    return (
        <div className={classes.fixedBase}>
            <NavMenu 
                isMenuOpen={isMenuOpen}
                toggleMenu={toggleMenu}
            />
            <div className={classes.pageBase}>
                <ToolBar
                    toggleMenu={toggleMenu}
                />
                <CardGrid>
                    {num.map((n, i) => <NoteCard title={'Note'} key={i} />)}
                </CardGrid>
                <Editor />
                <NavBar />
            </div>
        </div>
    )
};

export default hot(module)(App);