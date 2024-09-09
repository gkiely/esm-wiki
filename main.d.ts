declare module 'https://esm.sh/preact-custom-element' {
  export { default } from '@types/preact-custom-element';
}
declare module 'https://esm.sh/preact/hooks' {
  export * from 'preact/hooks';
}
declare module 'https://esm.sh/htm/preact' {
  export * from 'htm/preact';
}

declare module 'https://esm.sh/wouter-preact' {
  export * from 'wouter-preact';
}

declare module 'https://esm.sh/@preact/signals' {
  export * from '@preact/signals';
}

type Token = {
  access_token: string;
  expires_in: number;
  scope: string;
};

type GapiPromise<T> = {
  then: (o: (o: T) => unknown) => T;
  getPromise: () => Promise<T>;
};
type PermissionRole = 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
type Permission =
  | {
      id: 'anyoneWithLink' | 'anyone';
      role: PermissionRole;
      type: 'anyone';
    }
  | {
      id: string;
      role: PermissionRole;
      type: 'user' | 'group';
      emailAddress: string;
      displayName: string;
      photoLink: string;
      deleted?: boolean;
    }
  | {
      id: string;
      role: PermissionRole;
      type: 'domain';
      displayName: string;
    };

type BaseFile = {
  id: string;
  name: string;
  driveId?: string;
  explicitlyTrashed: boolean;
  iconLink?: string;
  parents?: [string]; // Parents is optional for anyoneWithLink files
  webViewLink: string;
  webContentLink: string;
  lastModifyingUser?: {
    displayName: string;
    photoLink?: string;
  };
  createdTime: string;
  modifiedTime: string;
  owners?: {
    displayName: string;
    photoLink?: string;
    emailAddress: string;
  }[];
  ownedByMe: boolean;
  permissions?: Permission[];
  properties?: {
    animations?: 'true' | 'false';
    color?: string;
    fontColor?: string;
    highlightTextMenu?: 'true' | 'false';
    showPrintButton?: 'true' | 'false';
    index?: string | null;
    parentId?: string | null; // Used to check if index is valid
    YNAW?: 'folder';
    unicode?: string;
    logoId?: string;
    logoURL?: string;
    sheetBorder?: 'true' | 'false';
    showPageTitle?: 'true' | 'false';
    collapsedMenu?: 'true' | 'false';
    showViewButtons?: 'true' | 'false';
    userMenu?: 'true' | 'false';
    showCreateWikiButton?: 'true' | 'false';
  };
  capabilities?: {
    canEdit: boolean;
    canDelete: boolean;
  };
  thumbnailLink?: string;
  imageMediaMetadata?: {
    width: number;
    height: number;
  };
  size: number;
};

type DriveDocument = BaseFile & {
  mimeType: 'application/vnd.google-apps.document';
};

// If you make updates here be sure to update server/types.ts
type DriveFile =
  // Shared drive
  | (Omit<BaseFile, 'parents'> & {
      mimeType: 'application/vnd.google-apps.folder';
      driveId: string;
      parents?: [string]; // Parents is optional for shared drives
    })
  | DriveDocument // Allows type narrowing
  | (BaseFile & {
      mimeType:
        | 'application/vnd.google-apps.document'
        | 'application/vnd.google-apps.folder'
        | 'application/vnd.google-apps.drawing'
        | 'application/vnd.google-apps.spreadsheet'
        | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        | 'application/vnd.google-apps.presentation'
        | 'application/vnd.ms-powerpoint'
        | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        | 'application/vnd.google-apps.form'
        | 'video/mp4'
        | 'video/quicktime'
        | 'text/markdown'
        | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        | 'application/pdf'
        | 'application/x-iwork-numbers-sffnumbers'
        | 'image/jpeg'
        | 'text/plain'
        | 'text/html'
        | 'image/png'
        | 'image/vnd.adobe.photoshop'
        | 'application/postscript'
        | 'image/svg+xml'
        | 'application/octet-stream'
        | 'application/json'
        | 'application/x-iwork-pages-sffpages'
        | 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
        | 'text/csv'
        | 'application/zip'
        | 'application/msword'
        | 'application/x-ms-shortcut';
    })
  // Shortcut
  | (BaseFile & {
      mimeType: 'application/vnd.google-apps.shortcut';
      shortcutDetails: {
        targetId: string;
        targetMimeType: Exclude<DriveFile['mimeType'], 'application/vnd.google-apps.shortcut'>;
        target?: DriveFile;
      };
    });
type ExportMimeType =
  | 'text/html'
  | 'text/plain'
  | 'text/csv'
  | 'text/markdown'
  | 'application/zip'
  | 'application/pdf'
  | 'application/rtf'
  | 'application/vnd.oasis.opendocument.text'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.oasis.opendocument.spreadsheet'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/vnd.oasis.opendocument.presentation'
  | 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
  | 'application/vnd.google-apps.script+json'
  | 'application/epub+zip'
  | 'text/tab-separated-values'
  | 'image/jpeg'
  | 'image/png'
  | 'image/svg+xml';

type GapiResponse<T> = GapiPromise<{
  body: string;
  headers: {
    'cache-control': 'no-cache, no-store, max-age=0, must-revalidate';
    'content-type': 'application/json; charset=UTF-8';
    'content-encoding': 'gzip';
    'content-length': string;
    date: string;
    expires: string;
    pragma: 'no-cache';
    server: 'ESF';
    vary: 'Origin, X-Origin';
  };
  status: 200;
  statusText: null;
  result: T;
}>;

type Params = {
  fields?: string;
  supportsAllDrives: true;
  includeItemsFromAllDrives: true;
};

type DriveAPI = {
  Export: {
    options: {
      path: `https://www.googleapis.com/drive/v3/files/${string}/export`;
      params: Params & {
        mimeType: ExportMimeType;
      };
    };
    response: GapiResponse<{ body: string }>;
  };
  Get: {
    options: {
      path: `https://www.googleapis.com/drive/v3/files/${string}`;
      params?: Params & {
        alt?: 'media';
      };
    };
    response: GapiResponse<DriveFile>;
  };
  List: {
    options: {
      path: 'https://www.googleapis.com/drive/v3/files';
      params: Params & {
        q: string;
        orderBy?: 'folder,name_natural';
        pageSize?: number;
      };
    };
    response: GapiResponse<{ files: DriveFile[]; nextPageToken?: string }>;
  };
};

// declare global gapi
declare const gapi: {
  client: {
    getToken: () => Token | null;
    request: {
      (options: DriveAPI['Get']['options']): DriveAPI['Get']['response'];
      (options: DriveAPI['Export']['options']): DriveAPI['Export']['response'];
      (options: DriveAPI['List']['options']): DriveAPI['List']['response'];
    };
  };
};

// withResolvers
declare const gapi_loaded: {
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: Error) => void;
};
