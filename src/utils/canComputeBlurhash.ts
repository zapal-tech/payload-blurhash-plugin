import { SUPPORTED_MIME_TYPES } from '../constants';

export const canComputeBlurhash = (mimeType: string): boolean => SUPPORTED_MIME_TYPES.includes(mimeType);
