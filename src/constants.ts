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

// Files
// http://localhost:3000/1DEAV9VXS1G8KXn1aR3nFTQdJoOs9gF6c/1ZlV5JZ94WjO33D9fvvRGtaf0mpWWxqza
