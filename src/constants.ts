import gup from './gup';

export const DEV = import.meta.env?.DEV;
export const hasWindow = typeof window !== 'undefined';
export const protocol = hasWindow ? window.location.protocol : '';
export const host = hasWindow ? window.location.hostname : '';
export const isBun = 'Bun' in globalThis || typeof window === 'undefined';
export const debug = DEV && gup('debug');

export const defaultParams = DEV
  ? {
      folderId: '1NqCSiMuEfPfaHTumR_rX6J8zo7ygjx8q',
      id: '1NqCSiMuEfPfaHTumR_rX6J8zo7ygjx8q',
    }
  : {};

export const mimeTypes = {
  folder: 'application/vnd.google-apps.folder',
  shortcut: 'application/vnd.google-apps.shortcut',
  document: 'application/vnd.google-apps.document',
  drawing: 'application/vnd.google-apps.drawing',
  spreadsheet: 'application/vnd.google-apps.spreadsheet',
  presentation: 'application/vnd.google-apps.presentation',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  form: 'application/vnd.google-apps.form',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  quicktime: 'video/quicktime',
  markdown: 'text/markdown',
  markdownX: 'text/x-markdown',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  numbers: 'application/x-iwork-numbers-sffnumbers',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  text: 'text/plain',
  html: 'text/html',
  png: 'image/png',
  jpg: 'image/jpeg',
  photoshop: 'image/vnd.adobe.photoshop',
  postscript: 'application/postscript',
  svg: 'image/svg+xml',
  octetStream: 'application/octet-stream',
  json: 'application/json',
  pages: 'application/x-iwork-pages-sffpages',
  slideshow: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  csv: 'text/csv',
  zip: 'application/zip',
  word: 'application/msword',
  msShortcut: 'application/x-ms-shortcut',
} satisfies Record<string, DriveMimeType>;

const allFields = import.meta.env?.DEV && hasWindow && /(\?|&)fields/.test(window.location.search);
export const fileFields = allFields
  ? '*'
  : 'id,name,mimeType,shortcutDetails,explicitlyTrashed,parents,webViewLink,webContentLink,createdTime,modifiedTime,owners(displayName,photoLink),ownedByMe,permissions(id,displayName,photoLink,role,type,emailAddress,deleted),lastModifyingUser(displayName,photoLink,me),properties,capabilities(canEdit,canDelete),iconLink,size,thumbnailLink,imageMediaMetadata/width,imageMediaMetadata/height,size';

// You can get 1000 entries with these fields
// If you include parents = 460
// If you include permissions = 100
const unrestrictedFields =
  'id,name,mimeType,shortcutDetails,webViewLink,webContentLink,createdTime,modifiedTime,owners(displayName,photoLink),ownedByMe,lastModifyingUser(displayName,photoLink,me),properties,capabilities(canEdit,canDelete),iconLink,size,thumbnailLink,imageMediaMetadata/width,imageMediaMetadata/height,size';
export const listFields = allFields ? 'files(*)' : `files(${unrestrictedFields},parents)`;
