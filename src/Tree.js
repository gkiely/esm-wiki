import { signal } from 'https://esm.sh/@preact/signals';
import { html } from 'https://esm.sh/htm/preact';
import { useEffect, useState } from 'https://esm.sh/preact/hooks';
import { Link } from 'https://esm.sh/wouter-preact';
import { filesSignal } from './signals';

const Folder = () => html`
  <div style="display: flex; flex: 1 0 1rem; max-width: 1rem; margin-top: 2px;">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  </div>
`;

const Document = () => html`
<div style="display: flex; flex: 1 0 1rem; max-width: 1rem; margin-top: 2px;">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
</div>
`;

// 7. Fetch files
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
 *
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.folderId
 * @param {string} props.rootFolderId
 */
const Tree = ({ id = '', folderId = '', rootFolderId = folderId }) => {
  /**
   * @type {[DriveFile[] | undefined, (value: DriveFile[]) => void]}
   */
  const [files, setFiles] = useState();

  useEffect(() => {
    fetchFiles(folderId)
      .then((files) => files.filter((file) => file.name !== 'wiki.logo' && file.name !== 'wiki.page'))
      .then((files) => {
        setFiles(files);
        // 9. Signals
        filesSignal.value = [...filesSignal.value, ...files];
      })
      .catch(console.error);
  }, []);

  return html`
    <ul>
      ${rootFolderId === folderId ? html`<li><${Link} href="/${folderId}" style="display: flex; gap: .5rem; align-items: center;">🏠 Home</${Link}></li>` : null}
      ${files?.map((file) => {
        return html`
        <li>
          <${Link} href="/${rootFolderId}/${file.id}" key={file.id} style="display: flex; gap: .5rem; align-items: center;">
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

// 9.1 Tree
/**
 *
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
