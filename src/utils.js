import { Document, Folder } from './icons.js';
import { html } from 'https://esm.sh/htm/preact';

/**
 *
 * @param {DriveFile} file
 */
export const getIcon = (file) => {
  const { mimeType, iconLink } = file;
  if (mimeType === 'application/vnd.google-apps.folder') {
    return html`<${Folder} />`;
  }

  if (mimeType === 'application/vnd.google-apps.document') {
    return html`<${Document} />`;
  }

  return iconLink
    ? html`<img src=${iconLink.replace('16', '32')} alt=${mimeType} style="width: 1rem; height: 1rem;" />`
    : null;
};
