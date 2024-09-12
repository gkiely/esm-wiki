import { html } from 'https://esm.sh/htm/preact';
import { useEffect, useState } from 'https://esm.sh/preact/hooks';
import { Link } from 'https://esm.sh/wouter-preact';
import { filesSignal } from './signals.js';
import { Document, Folder } from './icons.js';
import { getIcon } from './utils.js';

// @TODO: Fetch files

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
  const file = files?.find((o) => o.id);

  // useEffect(() => {
  //   fetchFiles(folderId)
  //     .then((files) => files.filter((file) => file.name !== 'wiki.logo' && file.name !== 'wiki.page'))
  //     .then((files) => {
  //       setFiles(files);
  //       // 9. Signals
  //       filesSignal.value = [...filesSignal.value, ...files];
  //     })
  //     .catch(console.error);
  // }, []);

  return html`
    <ul>
      ${rootFolderId === folderId ? html`<li><${Link} href="/${folderId}/${folderId}" style="display: flex; gap: .5rem; align-items: center;">🏠 Home</${Link}></li>` : null}
      ${files?.map((file) => {
        return html`
        <li>
          <${Link} href="/${rootFolderId}/${file.id}" key={file.id} style="display: flex; gap: .5rem; align-items: center;">
            ${getIcon(file)}
            ${file.id === id ? html`<strong>${file.name}</strong>` : file.name}
          </${Link}>
          ${file.mimeType === 'application/vnd.google-apps.folder' ? html`` : ''}
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
            ${getIcon(file)}
            ${file.name}
          </${Link}>
        </li>
      `;
      })}
    </ul>
  `;
};

export default Tree;
