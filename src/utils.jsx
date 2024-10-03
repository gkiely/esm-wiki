import { Document, Folder } from './icons.js';

/**
 * @param {DriveFile} file
 */
export const getIcon = (file) => {
  const { mimeType, iconLink } = file;
  if (mimeType === 'application/vnd.google-apps.folder') {
    return <Folder />;
  }

  if (mimeType === 'application/vnd.google-apps.document') {
    return <Document />;
  }

  return iconLink ? <img src={iconLink.replace('16', '32')} alt={mimeType} style="width: 1rem; height: 1rem;" /> : null;
};
