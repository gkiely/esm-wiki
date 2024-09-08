declare module 'https://esm.sh/preact-custom-element' {
  export { default } from '@types/preact-custom-element';
}
declare module 'https://esm.sh/preact/hooks' {
  export * from 'preact/hooks';
}
declare module 'https://esm.sh/htm/preact' {
  export * from 'htm/preact';
}

type Token = {
  access_token: string;
  expires_in: number;
  scope: string;
};

// declare global gapi
declare const gapi: {
  client: {
    getToken: () => Token | null;
  };
};

// withResolvers
declare const gapi_loaded: {
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: Error) => void;
};
