import React from 'react';
import { hot } from 'react-hot-loader';

import { makeStyles } from '@material-ui/core/styles';

import PageBar from './components/DashBoard/PageBar';
import NavBar from './components/DashBoard/NavBar';
import NavMenu from './components/DashBoard/NavMenu/NavMenu';
import RecordingCard from './components/Cards/RecordingCard';
import NoteCard from './components/Cards/NoteCard';
import CategoryCard from './components/Cards/CategoryCard';

import useToggle from './utils/hooks/useToggle';
import MasonryGrid from './components/Layout/MasonryGrid';

const useStyles = makeStyles(() => ({
    fixedBase: {
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'fixed'
    },
    pageBase: {
        transform: 'rotateX(0)', // for fixed bars to latch on to
        height: '100%',
        width: '100%',
        minWidth: 300
    }
}));

const gridStyle: React.CSSProperties = {
    padding: 5
};

const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0px 5px'
}

const App: React.FC = (): React.ReactElement => {
    const classes = useStyles();

    const [num, setNum] = React.useState([1, 1, 1, 1]);
    const [cols, setCols] = React.useState(2);
    const [isMenuOpen, toggleMenu] = useToggle(false);
    const [title, setTitle] = React.useState('Note');

    return (
        <div className={classes.fixedBase}>
            <NavMenu 
                isMenuOpen={isMenuOpen}
                toggleMenu={toggleMenu}
            />
            <div className={classes.pageBase}>
                {/* <PageBar
                    toggleMenu={toggleMenu}
                /> */}
                {/* <button onClick={() => setNum(n => n.slice(0, n.length-1))}>Remove Item</button> */}
                <button onClick={() => setTitle('New Title')}>Subtract Column</button>
                <MasonryGrid gridStyle={gridStyle} columnStyle={columnStyle}>
                    {num.map((n, i) => <NoteCard title={title} key={i} />)}
                </MasonryGrid>
                <NavBar />
            </div>
        </div>
    )
};

export default hot(module)(App);