import Recording from '../../db/models/Recording';
import { RecordingController } from '../../db/controllers/Recording';

function useRecordingData(ids: string[]): Recording[];
function useRecordingData(ids: string): Recording;
function useRecordingData(ids: string | string[]): Recording | Recording[] {
    return new Recording("test");
}

export default useRecordingData;