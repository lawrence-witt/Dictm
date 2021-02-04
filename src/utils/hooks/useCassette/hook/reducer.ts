import React from 'react';

import { State, Actions } from './hookTypes';

export const initialState: State = {
    id: "waiting" as const,
    hasStream: false,
    hasData: false,
    isBuffering: false,
    tapeProgress: 0,
    tapeDuration: 0,
    encodePercent: 0,
    encodedBlob: null
};

const cassetteReducer: React.Reducer<State, Actions> = (
    state: State,
    action: Actions
) => {
    if (action.type === 'reset') return initialState;

    switch(action.type) {
        case 'fileSelected':
            return {...state, isBuffering: true};
        case 'fileBuffered':
            return {
                ...state, 
                tapeDuration: action.payload, 
                hasData: true, 
                isBuffering: false
            };
        case 'fileError':
            return {...state, isBuffering: false};
        case 'connected':
            return {...state, hasStream: true};
        case 'disconnected': {
            const { id, isBuffering } = state;
            return {
                ...state, 
                id: id === 'recording' ? 'paused' : id, 
                hasStream: false, 
                isBuffering: id === 'recording' ? true : isBuffering
            };
        }
        case 'connectError':
            return {...state, hasStream: false};
        case 'tapeProgress':
            const { progress, duration } = action.payload;
            return {...state, tapeProgress: progress, tapeDuration: duration};
        case 'recStarted':
            return {...state, id: 'recording'};
        case 'recEnded':
            return {...state, id: 'paused', isBuffering: true};
        case 'recBuffered':
            return {...state, hasData: true, isBuffering: false};
        case 'recError':
            return {...state, id: 'waiting'};
        case 'encodeStarted':
            return {...state, encodePercent: 0, encodedBlob: null};
        case 'encodeProgress':
            return {...state, encodePercent: action.payload};
        case 'encodeEnded':
            return {...state, encodedBlob: action.payload};
        case 'encodeError':
            return state;
        case 'playStarted':
            return {...state, id: 'playing'};
        case 'playEnded':
            return {...state, id: 'paused'};
        case 'playError': {
            return {...state, id: 'paused'};
        }
        default:
            return state;
    }
};

export default cassetteReducer;