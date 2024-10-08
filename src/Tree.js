import { html } from 'https://esm.sh/htm/preact';
import { Link } from 'https://esm.sh/wouter-preact';
import { filesSignal } from './signals.js';
import { Document, Folder } from './icons.js';
import { useQuery } from 'https://esm.sh/preact-fetching';

const fetchFiles = async (id = '') => {
  const response = await gapi.client.request({
    path: 'https://www.googleapis.com/drive/v3/files',
    params: {
      q: `'${id}' in parents and trashed = false`,
      fields: '*',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    },
  });

  return response.result.files;
};

const getIcon = (mimeType = '', iconLink = '') => {
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

/**
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.folderId
 * @param {string} props.rootFolderId
 */
const Tree = ({ id = '', folderId = '', rootFolderId = folderId }) => {
  const { data: files } = useQuery(`/drive/v3/files?q='${folderId}' in parents`, async () => {
    const files = (await fetchFiles(folderId)).filter((file) => file.name !== 'wiki.logo' && file.name !== 'wiki.page');
    filesSignal.value = [...filesSignal.value, ...files];
    return files;
  });

  return html`
    <ul>
      ${rootFolderId === folderId ? html`<li><${Link} href="/${folderId}/${folderId}" style="display: flex; gap: .5rem; align-items: center;">🏠 Home</${Link}></li>` : null}
      ${files?.map((file) => {
        return html`
        <li>
          <${Link} aria-current="page" href="/${rootFolderId}/${file.id}" key={file.id} style="display: flex; gap: .5rem; align-items: center;">
            ${getIcon(file.mimeType, file.iconLink)}
            ${file.id === id ? html`<strong>${file.name}</strong>` : file.name}
          </${Link}>
          ${
            file.mimeType === 'application/vnd.google-apps.folder'
              ? html`
            <${Tree} id=${id} folderId=${file.id} rootFolderId=${rootFolderId}  />
          `
              : null
          }
        </li>
      `;
      })}
    </ul>    
  `;
};

/**
 * @param {object} props
 * @param {DriveFile[]} props.files
 * @param {string} props.folderId
 * @returns
 */
export const StaticTree = ({ files, folderId = '' }) => {
  return html`
    <ul>
      ${files?.map((file) => {
        return html`
        <li>
          <${Link} href="/${folderId}/${file.id}" key={file.id} style="display: flex; gap: .5rem; align-items: center;">
            ${getIcon(file.mimeType, file.iconLink)}
            ${file.name}
          </${Link}>
        </li>
      `;
      })}
    </ul>
  `;
};

export default Tree;
