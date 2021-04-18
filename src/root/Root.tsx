import React from 'react';
import { hot } from 'react-hot-loader';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { historyOperations } from '../redux/ducks/history';

/* 
*   Redux
*/

const mapDispatch = {
    changeLocation: historyOperations.changeLocation
}

const connector = connect(null, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

/* 
*   Local
*/

const Root: React.FC<ReduxProps> = (props) => {
    const {
        changeLocation
    } = props;

    const history = useHistory();

    React.useLayoutEffect(() => {
        const unlisten = history.listen((location) => {
            changeLocation(location);
        });

        changeLocation(history.location);

        return () => unlisten();
    }, [history, changeLocation]);
    
    return <></>;
}

export default hot(module)(connector(Root));