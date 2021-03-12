import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import MasonryGrid from './MasonryGrid';

// Types

interface CardGridProps {
    onFabClick: () => void;
}

// Styled

const useStyles = makeStyles(() => 
    createStyles({
        cardGridRoot: {
            display: 'grid',
            gridTemplate: 'auto min-content 0.1px / 100%',
            height: '100%',
            width: '100%',
            overflowY: 'auto',

            // Fix for grid/sticky glitch on FireFox
            "&:after": {
                content: "''"
            },

            "& .card-grid": {
                display: 'flex',
                height: '100%',
                width: '100%',
                padding: 8,
            },
            "& .card-col": {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'flex-start',
                padding: 8,

                "& > div:not(:last-child)": {
                    marginBottom: 16
                }
            }
        },
        fab: {
            position: 'sticky',
            justifySelf: 'end',
            width: 50,
            height: 50,
            bottom: 16,
            right: 16,
            marginTop: 16
        }
    })  
);

// Component

const CardGrid: React.FC<CardGridProps> = (props) => {
    const {
        onFabClick,
        children
    } = props;

    const classes = useStyles();

    return (
        <div className={classes.cardGridRoot}>
            <MasonryGrid
                gridClass="card-grid"
                colClass="card-col"
                repeat="auto-fill"
            >
                {children}
            </MasonryGrid>
            <Fab 
                onClick={onFabClick}
                color="secondary" 
                className={classes.fab}
            >
                <AddIcon/>
            </Fab>
        </div>
    )
}

export default CardGrid;