import Recording from '../../../db/models/Recording';
import Note from '../../../db/models/Note';
import Category from '../../../db/models/Category';

type ById = Record<string, Recording | Note | Category>;
type AllIds = string[];

export interface ContentSlice {
    byId: ById;
    allIds: AllIds;
}

interface SortFunction {
    (byId: ById, allIds: AllIds): ContentSlice;
}

const sortTimestamps = (
    direction: 'ascending' | 'descending',
    stamp: 'created' | 'modified'
): SortFunction => {
    return (byId, allIds) => ({
        byId,
        allIds: [...allIds].sort((a, b) => {
            const aStamp = byId[a].attributes.timestamps[stamp];
            const bStamp = byId[b].attributes.timestamps[stamp];

            return {
                ascending: aStamp - bStamp,
                descending: bStamp - aStamp
            }[direction]
        })
    })
};

const sortAlphabetical = (
    direction: 'ascending' | 'descending'
): SortFunction => {
    return (byId, allIds) => ({
        byId,
        allIds: [...allIds].sort((a, b) => {
            const aTitle = byId[a].attributes.title;
            const bTitle = byId[b].attributes.title;

            return {
                ascending: aTitle > bTitle ? 1 : -1,
                descending: aTitle > bTitle ? -1 : 1
            }[direction]
        })
    })
};

export const sortFunctions = {
    createdAsc: sortTimestamps('ascending', 'created'),
    createdDesc: sortTimestamps('descending', 'created'),
    modifiedAsc: sortTimestamps('ascending', 'modified'),
    modifiedDesc: sortTimestamps('descending', 'modified'),
    alphaAsc: sortAlphabetical('ascending'),
    alphaDesc: sortAlphabetical('descending')
};