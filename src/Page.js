import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import { html } from 'https://esm.sh/htm/preact';
import { filesSignal } from './signals';
import { StaticTree } from './Tree';
import { Link } from 'https://esm.sh/wouter-preact';

// 4. Fetch content
// https://developers.google.com/drive/api/reference/rest/v3/files/export
const fetchContent = async ({ id = '' }) => {
  const response = await gapi.client.request({
    path: `https://www.googleapis.com/drive/v3/files/${id}/export`,
    params: {
      fields: '*',
      mimeType: 'text/html',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    },
  });

  return response.body;
};

const fetchFile = async ({ id = '' }) => {
  const response = await gapi.client.request({
    path: `https://www.googleapis.com/drive/v3/files/${id}`,
    params: {
      fields: '*',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    },
  });

  return response.result;
};

const Page = ({ folderId = '', id = '' }) => {
  // 4.1 Fetch content
  const [content, setContent] = useState('');
  const [, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Fetch file
   * @type {[DriveFile | undefined, (value: DriveFile) => void]}
   */
  const [file, setFile] = useState();

  // 5.
  // Edit button
  // Refresh on focus
  useEffect(() => {
    if (!id) return;
    /**
     * Focus event
     * @param {FocusEvent} [e]
     */
    const onFocus = (e) => {
      if (!e) {
        setLoading(true);
      }
      Promise.allSettled([
        fetchContent({ id })
          .then(setContent)
          .catch(() => setContent('')),
        fetchFile({ id }).then((file) => {
          setFile(file);
        }),
      ])
        .catch(() => setError('Failed to fetch content'))
        .finally(() => setLoading(false));
    };
    onFocus();

    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [id]);

  // 6. Pressing e will open the edit link
  useEffect(() => {
    /**
     * @param {KeyboardEvent} event
     */
    const onKeyDown = (event) => {
      if (event.key === 'e') {
        window.open(`https://docs.google.com/document/d/${id}/edit`, '_blank');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [id]);

  const files = filesSignal.value;

  // 9.2 Static tree
  const children =
    file && file.mimeType === 'application/vnd.google-apps.folder'
      ? files.filter((o) => o.parents?.[0] === file.id)
      : [];

  // 10. Prev/Next
  const siblings = files.filter((o) => o.parents?.[0] === file?.parents?.[0]);
  const lastSibling = siblings[siblings.length - 1];
  const fileIndex = siblings.findIndex((o) => o.id === id);
  const prevSibling = siblings[fileIndex - 1] ?? lastSibling;
  const prevSiblingChildren = prevSibling ? files.filter((o) => o.parents?.[0] === prevSibling.id) : [];
  const parent = files.find((o) => o.id === file?.parents?.[0]);
  const prev = prevSiblingChildren[prevSiblingChildren.length - 1] ?? prevSibling ?? parent;

  const parentFolders = files.filter((o) => o.parents?.[0] === parent?.parents?.[0]);
  const parentIndex = parentFolders.findIndex((o) => o.id === parent?.id);
  const next = children[0] ?? siblings[fileIndex + 1] ?? parentFolders[parentIndex + 1] ?? parentFolders[0];

  // 1. Static content
  return html`
    <div class="Page">
      <a target="_blank" href="https://docs.google.com/document/d/${id}/edit">Edit</a>
      <h1>${file?.name}</h1>
      ${file?.mimeType === 'application/vnd.google-apps.folder' && html`<${StaticTree} files=${children} />`}
      <p class="content">
        ${loading ? 'Loading...' : ''}
        ${content ? html`<div dangerouslySetInnerHTML=${{ __html: content }}></div>` : ''}
      </p>
      <div class="nav">
        ${prev && html`<${Link} href="/${folderId}/${prev.id}">← ${prev.name}</${Link}>`}
        ${prev && next && html`<span style="color: #646cff"> | </span>`}
        ${next && html`<${Link} href="/${folderId}/${next.id}">${next.name} →</${Link}>`}
      </div>
    </div>
  `;
};

export default Page;
