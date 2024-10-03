export const DEV = import.meta.env?.DEV;
export const hasWindow = typeof window !== 'undefined';
export const protocol = hasWindow ? window.location.protocol : '';
export const host = hasWindow ? window.location.hostname : '';
