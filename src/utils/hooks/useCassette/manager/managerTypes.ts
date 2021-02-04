type ManagerExceptions =
    | 'NoRecorder'
    | 'RecorderActive'
    | 'RecorderInactive'
    | 'PlayBackActive'
    | 'PlayBackInactive'
    | 'NoBuffer'
    | 'Buffering'

type Dispatches =
    | {key: 'reset', args?: undefined}
    | {key: 'fileSelected', args?: undefined}
    | {key: 'fileBuffered', args: {duration: number, increment: number}}
    | {key: 'fileError', args: Error}
    | {key: 'connected', args?: undefined}
    | {key: 'disconnected', args?: undefined}
    | {key: 'connectError', args: Error}
    | {key: 'tapeProgress', args: {progress: number, duration: number, increment: number}}
    | {key: 'recStarted', args?: undefined}
    | {key: 'recEnded', args?: undefined}
    | {key: 'recBuffered', args?: undefined}
    | {key: 'recError', args: Error}
    | {key: 'encodeStarted', args?: undefined}
    | {key: 'encodeProgress', args: number}
    | {key: 'encodeEnded', args: Blob}
    | {key: 'encodeError', args: string}
    | {key: 'playStarted', args?: undefined}
    | {key: 'playEnded', args?: undefined}

export {
    ManagerExceptions,
    Dispatches
}