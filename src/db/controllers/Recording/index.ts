import {
    selectRecording,
    selectRecordingsById,
    selectRecordingsByUserId,
    insertRecording,
    updateRecording,
    deleteRecording,
    deleteRecordings,
    _insertRecording,
    _updateRecording,
    _deleteRecording,
    _deleteRecordings
} from './RecordingController';

export default {
    selectRecording,
    selectRecordingsById,
    selectRecordingsByUserId,
    insertRecording,
    updateRecording,
    deleteRecording,
    deleteRecordings
}

export const _RecordingController = {
    _insertRecording,
    _updateRecording,
    _deleteRecording,
    _deleteRecordings
}