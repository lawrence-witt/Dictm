import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { CassetteProgressCallback, CassetteAnalysisCallback } from 'cassette-js';
import { ProgressHandle, AnalysisHandle } from './RecordingEditor.types';

import { useCassetteControls } from '../../../../utils/providers/CassetteProvider';

interface WaveFormProps {
    progressHandle: React.RefObject<ProgressHandle>;
    analysisHandle: React.RefObject<AnalysisHandle>;
}

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: 250,
        position: 'relative',
        borderTop: '1px solid red'
    },
    tape: {
        width: '100%',
        height: 225,
        position: 'absolute',
        bottom: 0,
        background: theme.palette.grey[200]
    }
}));

const WaveForm: React.FC<WaveFormProps> = (props) => {
    const {
        progressHandle,
        analysisHandle,
    } = props;

    const classes = useStyles();

    const { scanTo } = useCassetteControls();

    const increment = React.useCallback<CassetteProgressCallback>((p: number, d: number) => {
        //
    }, []);

    const output = React.useCallback<CassetteAnalysisCallback>((analysis) => {
        //
    }, []);

    React.useImperativeHandle(progressHandle, () => ({
        increment
    }), [increment]);

    React.useImperativeHandle(analysisHandle, () => ({
        output
    }), [output]);

    return (
        <div className={classes.container}>
            <div className={classes.tape}></div>
        </div>
    )
};

export default WaveForm;