import React from 'react';

import Recording from '../models/Recording';
import RecordingController from '../controllers/Recording';

type RecordingData = Recording["data"] | undefined;

function useRecordingData(ids: string[]): Array<RecordingData>;
function useRecordingData(ids: string): RecordingData;
function useRecordingData(ids: string | string[]): RecordingData | Array<RecordingData> {
    const [data, setData] = React.useState<RecordingData | Array<RecordingData>>(undefined);

    React.useEffect(() => {
        (async () => {
            const singleRequest = (input: string | string[]): input is string => typeof input === "string";
            const extractData = (recording: Recording | undefined) => recording && recording.data;

            const query = singleRequest(ids) ? [ids] : ids;
            const recordings = await RecordingController.selectRecordingsById(query);

            setData(() => {
                if (singleRequest(ids)) return extractData(recordings[0]);
                return ids.map(id => extractData(recordings.find(recording => recording.id === id)))
            })
        })();
    }, [ids]);

    return data;
}

export default useRecordingData;