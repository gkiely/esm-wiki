export const DEV = import.meta.env?.DEV;
export const hasWindow = typeof window !== 'undefined';
export const protocol = hasWindow ? window.location.protocol : '';
export const host = hasWindow ? window.location.hostname : '';

export const defaultParams = DEV
  ? {
      folderId: '1NqCSiMuEfPfaHTumR_rX6J8zo7ygjx8q',
      id: '1NqCSiMuEfPfaHTumR_rX6J8zo7ygjx8q',
    }
  : {};
