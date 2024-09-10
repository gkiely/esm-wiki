import { useState, useEffect, useCallback } from 'https://esm.sh/preact/hooks';
import { html } from 'https://esm.sh/htm/preact';
import { filesSignal } from './signals.js';
import { StaticTree } from './Tree.js';
import { Link, useLocation } from 'https://esm.sh/wouter-preact';
import { Folder, Pencil, Spinner } from './icons.js';
import { getPrevNext } from './getPrevNext.js';
import { parseContent } from './parseContent.js';

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
  return parseContent(response.body);
};

// Fetch file
// https://developers.google.com/drive/api/reference/rest/v3/files/get
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

  const files = filesSignal.value;

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
      // Is not a focus event
      if (!e) {
        setLoading(true);
        const file = files.find((o) => o.id === id);
        if (file) {
          setFile(file);
          file.mimeType === 'application/vnd.google-apps.folder'
            ? Promise.resolve('')
                .then(setContent)
                .finally(() => setLoading(false))
            : fetchContent({ id })
                .then(setContent)
                .catch(() => setContent(''))
                .finally(() => setLoading(false));
          return;
        }
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

  // 9.2 Static tree
  const children =
    file && file.mimeType === 'application/vnd.google-apps.folder'
      ? files.filter((o) => o.parents?.[0] === file.id)
      : [];

  // 10. Prev/Next
  const { prev, next } = getPrevNext({ file, files, id });

  // 11. Prev/Next keyboard navigation
  const setLocation = useLocation()[1];

  // 6. Pressing e will open the edit link
  /**
   * @type {(event: KeyboardEvent) => void}
   */
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'e') {
        window.open(`https://docs.google.com/document/d/${id}/edit`, '_blank');
      }
      if (event.key === 'ArrowLeft' && prev) {
        setLocation(`/${folderId}/${prev.id}`);
      }
      if (event.key === 'ArrowRight' && next) {
        setLocation(`/${folderId}/${next.id}`);
      }
    },
    [prev?.id, next?.id, id]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  // 1. Static content
  return html`
    <div class="Page">
      ${file?.mimeType === 'application/vnd.google-apps.folder' && html`<a target="_blank" class="button" href="https://drive.google.com/drive/folders/${file.id}"><${Folder} /> View in Drive</a>`}
      ${file?.mimeType === 'application/vnd.google-apps.document' && html`<a target="_blank" class="button" href="https://docs.google.com/document/d/${file.id}/edit"><${Pencil} /> Edit</a>`}
      <h1>${file?.name}</h1>
      <p class="content">
        ${loading ? html`<${Spinner} />` : ''}
        ${content ? html`<div dangerouslySetInnerHTML=${{ __html: content }}></div>` : ''}
      </p>
      ${file?.mimeType === 'application/vnd.google-apps.folder' && html`<${StaticTree} folderId=${folderId} files=${children} />`}      
      <div class="nav">
        ${prev && html`<${Link} href="/${folderId}/${prev.id}">← ${prev.name}</${Link}>`}
        ${prev && next && html`<span style="color: #646cff"> | </span>`}
        ${next && html`<${Link} href="/${folderId}/${next.id}">${next.name} →</${Link}>`}
      </div>
    </div>
  `;
};

export default Page;
