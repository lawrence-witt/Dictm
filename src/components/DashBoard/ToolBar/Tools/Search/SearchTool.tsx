import React from 'react';

import InputBase from '@material-ui/core/InputBase';
import { makeStyles, fade } from '@material-ui/core/styles';

const useSearchStyles = makeStyles(theme => ({
    search: {
        width: '100%',
        maxWidth: 400,
        borderRadius: theme.shape.borderRadius,
        background: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            background: fade(theme.palette.common.white, 0.35),
        },
        "&:focus-within": {
            background: fade(theme.palette.common.white, 0.35)
        }
    },
    inputRoot: {
        color: theme.palette.common.white,
        width: '100%'
    },
    inputInput: {
        padding: theme.spacing(1)
    }
}));

const SearchTool: React.FC = () => {
    const classes = useSearchStyles();

    return (
        <div className={classes.search}>
            <InputBase
                type="search"
                placeholder="Search"
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                }}
            />
        </div>
    );
}

export default SearchTool;