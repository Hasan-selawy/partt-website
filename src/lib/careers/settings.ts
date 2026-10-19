import path from 'node:path';

// Runtime private storage is mounted by the host; never bundle it into Next output.
export const careersDataDir = path.resolve(/* turbopackIgnore: true */ process.env.CAREERS_DATA_DIR || '.local/careers');
export const careersOrigin = process.env.NEXT_PUBLIC_SERVER_URL || (process.env.NODE_ENV === 'production' ? 'https://www.parttagency.com' : 'http://localhost:3000');
export const MAX_CV_BYTES = 5 * 1024 * 1024;
