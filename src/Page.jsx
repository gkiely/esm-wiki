import { useEffect } from 'preact/hooks';
import { filesSignal } from './signals.js';
import { StaticTree } from './Tree.jsx';
import { Link, useLocation } from 'wouter-preact';
import { Folder, Pencil, Spinner } from './icons';
import { getPrevNext } from './getPrevNext';
import { parseContent } from './parseContent';
import { useQuery } from 'preact-fetching';

/**
 * Fetch content
 * https://developers.google.com/drive/api/reference/rest/v3/files/export
 * @param {object} options
 * @param {string} options.id
 */
const fetchContent = async ({ id }) => {
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

/**
 * Fetch file
 * https://developers.google.com/drive/api/reference/rest/v3/files/get
 * @param {object} options
 * @param {string} options.id
 */
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
    data,
    isLoading: isLoadingFile,
    refetch: refetchFile,
  } = useQuery(`/drive/v3/files/${id}`, () => fetchFile({ id }));

  const file = data?.id === id ? data : files.find((o) => o.id === id);

  const {
    data: content,
    isLoading: isLoadingContent,
    refetch: refetchContent,
  } = useQuery(file ? `/drive/v3/files/${id}/export` : null, () => {
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
        if (file?.mimeType === 'application/vnd.google-apps.folder')
          return window.open(`https://drive.google.com/drive/folders/${id}`, '_blank');
        return window.open(`https://docs.google.com/document/d/${id}/edit`, '_blank');
      }
      if (event.key === 'ArrowLeft' && prev) {
        setLocation(`/${folderId}/${prev.id}`);
      }
      if (event.key === 'ArrowRight' && next) {
        setLocation(`/${folderId}/${next.id}`);
      }
    };
    window.addEventListener('keydown', cb);
    return () => window.removeEventListener('keydown', cb);
  }, [id, prev?.id, next?.id]);

  return (
    <div class="Page">
      {file?.mimeType === 'application/vnd.google-apps.folder' && (
        <a target="_blank" class="button" href={`https://drive.google.com/drive/folders/${file.id}`}>
          <Folder /> View in Drive
        </a>
      )}
      {file?.mimeType === 'application/vnd.google-apps.document' && (
        <a target="_blank" class="button" href={`https://docs.google.com/document/d/${file.id}/edit`}>
          <Pencil /> Edit
        </a>
      )}
      <h1>{file?.name}</h1>
      <div class="content">
        {loading ? <Spinner /> : ''}
        {content ? <div dangerouslySetInnerHTML={{ __html: content }} /> : ''}
      </div>
      {file?.mimeType === 'application/vnd.google-apps.folder' && <StaticTree folderId={folderId} files={children} />}
      <div class="nav">
        {prev && <Link href={`/${folderId}/${prev.id}`}>← {prev.name}</Link>}
        {prev && next && <span style="color: #646cff"> | </span>}
        {next && <Link href={`/${folderId}/${next.id}`}>{next.name} →</Link>}
      </div>
    </div>
  );
};

export default Page;
