import { useState, useEffect, useCallback } from 'https://esm.sh/preact/hooks';
import { html } from 'https://esm.sh/htm/preact';
import { filesSignal } from './signals.js';
import { StaticTree } from './Tree.js';
import { Link, useLocation } from 'https://esm.sh/wouter-preact';
import { Folder, Pencil, Spinner } from './icons.js';

/**
 * @param {string} url
 */
function getDomain(url) {
  const hostname = new URL(url).hostname;
  const parts = hostname.split('.');
  return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
}

const whitelist = ['youtube.com', 'loom.com', 'google.com', 'docs.google.com', 'drive.google.com'];
/**
 * Parses iframe content
 * @param {string} html
 */
const parseContent = (html = '') => {
  console.log(html);
  return html.replace(
    /(&lt;div((?!&gt;).)*&gt;)?&lt;iframe((?!&gt;).)*&gt;(&lt;\/iframe&gt;)(&lt;\/div&gt;)?/g,
    (str) => {
      const match = str.replace(/&quot;/g, '"').match(/src="([^"]+)"/)?.[1];
      const url = match ? getDomain(match) : undefined;
      if (url && whitelist.includes(url)) {
        return str
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"');
      }
      return str;
    }
  );
};

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
          fetchContent({ id })
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

  // 9.2 Static tree
  const children =
    file && file.mimeType === 'application/vnd.google-apps.folder'
      ? files.filter((o) => o.parents?.[0] === file.id)
      : [];

  // 10. Prev/Next
  const siblings = files.filter((o) => o.parents?.[0] === file?.parents?.[0]);
  const lastSibling = siblings[siblings.length - 1];
  const fileIndex = siblings.findIndex((o) => o.id === id);
  const prevSibling = siblings[fileIndex - 1];
  const prevSiblingChildren = prevSibling
    ? files.filter((o) => o.parents?.[0] === prevSibling.id)
    : files.filter((o) => o.parents?.[0] === lastSibling?.id);
  const parent = files.find((o) => o.id === file?.parents?.[0]);
  const prev = prevSiblingChildren[prevSiblingChildren.length - 1] ?? prevSibling ?? parent;
  const parentFolders = files.filter((o) => o.parents?.[0] === parent?.parents?.[0]);
  const parentIndex = parentFolders.findIndex((o) => o.id === parent?.id);
  const next = children[0] ?? siblings[fileIndex + 1] ?? parentFolders[parentIndex + 1] ?? parentFolders[0];

  // 11. Prev/Next keyboard navigation
  const setLocation = useLocation()[1];

  /**
   * @type {(event: KeyboardEvent) => void}
   */
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowLeft' && prev) {
        setLocation(`/${folderId}/${prev.id}`);
      }
      if (event.key === 'ArrowRight' && next) {
        setLocation(`/${folderId}/${next.id}`);
      }
    },
    [prev?.id, next?.id]
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
      ${file?.mimeType === 'application/vnd.google-apps.folder' && html`<a target="_blank" style="display: flex; align-items: center; gap: .3rem;" href="https://drive.google.com/drive/folders/${file.id}"><${Folder} /> View in Drive</a>`}
      ${file?.mimeType === 'application/vnd.google-apps.document' && html`<a target="_blank" style="display: flex; align-items: center; gap: .3rem;" href="https://docs.google.com/document/d/${file.id}/edit"><${Pencil} /> Edit</a>`}
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
