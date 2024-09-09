import { signal, Signal } from 'https://esm.sh/@preact/signals';

/**
 * @type {Signal<DriveFile[]>}
 */
export const filesSignal = signal([]);

/**
 * @type {Signal<DriveFile | undefined>}
 */
export const fileSignal = signal();
