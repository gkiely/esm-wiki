import { useEffect } from 'https://esm.sh/preact/hooks';
import { html } from 'https://esm.sh/htm/preact';
import { filesSignal } from './signals.js';
import { StaticTree } from './Tree.js';
import { Link, useLocation } from 'https://esm.sh/wouter-preact';
import { Folder, Pencil, Spinner } from './icons.js';
import { getPrevNext } from './getPrevNext.js';
import { parseContent } from './parseContent.js';
import { useQuery } from 'https://esm.sh/preact-fetching';

// Fetch content
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
  const files = filesSignal.value;
  const {
    data: file = files.find((o) => o.id === id),
    isLoading: isLoadingFile,
    refetch: refetchFile,
  } = useQuery(`/drive/v3/files/${id}`, () => fetchFile({ id }));
  const {
    data: content,
    isLoading: isLoadingContent,
    refetch: refetchContent,
  } = useQuery(`/drive/v3/files/${id}/export`, () => {
    if (file?.mimeType === 'application/vnd.google-apps.folder') return;
    return fetchContent({ id });
  });

  const loading = isLoadingFile || isLoadingContent;

  useEffect(() => {
    const cb = () => {
      refetchFile();
      refetchContent();
    };

    window.addEventListener('focus', cb);
    return () => window.removeEventListener('focus', cb);
  }, [id]);

  // 9.2 Static tree
  const children =
    file && file.mimeType === 'application/vnd.google-apps.folder'
      ? files.filter((o) => o.parents?.[0] === file.id)
      : [];

  const { prev, next } = getPrevNext({ file, files, id });
  const setLocation = useLocation()[1];

  useEffect(() => {
    /**
     * @param {KeyboardEvent} event
     */
    const cb = (event) => {
      if (event.key === 'e') {
        window.open(`https://docs.google.com/document/d/${id}/edit`, '_blank');
      }
      if (event.key === 'ArrowLeft' && prev) {
        console.log('prev', prev.id);
        setLocation(`/${folderId}/${prev.id}`);
      }
      if (event.key === 'ArrowRight' && next) {
        console.log('next', next.id);
        setLocation(`/${folderId}/${next.id}`);
      }
    };
    window.addEventListener('keydown', cb);
    return () => window.removeEventListener('keydown', cb);
  }, [id, prev?.id, next?.id]);

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
