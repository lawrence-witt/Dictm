const k = 1024;
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] as const;

export const formatFileSize = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const dm = decimals < 0 ? 0 : decimals;

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const unformatFileSize = (value: number, unit: typeof sizes[number]): number => {
    if (unit === 'Bytes') return value;

    const i = sizes.indexOf(unit);
    if (i === -1) return i;

    return Math.round(value * Math.pow(k, i));
}

export const formatStringBytes = (data: string): string => {
    return formatFileSize(new TextEncoder().encode(data).length);
}