import React from 'react';
import { useDebouncedCallback as useDebounce } from 'use-debounce';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../../../redux/store';

import { toolOperations } from '../../../../../redux/ducks/tools';

import InputBase from '@material-ui/core/InputBase';
import { makeStyles, fade } from '@material-ui/core/styles';

/* 
*   Redux
*/

const mapState = (state: RootState) => ({
    searchTerm: state.tools.search.term
});

const mapDispatch = {
    setSearchTerm: toolOperations.setSearchTerm
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

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

const SearchTool: React.FC<ReduxProps> = (props) => {
    const {
        searchTerm,
        setSearchTerm
    } = props;

    const classes = useSearchStyles();

    const [presentation, setPresentation] = React.useState(searchTerm);

    const debounced = useDebounce((value: string) => {
        setSearchTerm(value);
    }, 250);

    const onInputChange = React.useCallback((
        ev: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPresentation(ev.target.value);
        debounced(ev.target.value);
    }, [debounced]);

    return (
        <div className={classes.search}>
            <InputBase
                type="search"
                placeholder="Search"
                value={presentation}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                }}
                onChange={onInputChange}
            />
        </div>
    );
}

export default connector(SearchTool);