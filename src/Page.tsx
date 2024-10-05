import { useEffect } from 'react';
import useSWR from 'swr';
import { Link, useLocation } from 'wouter';
import { getPrevNext } from './getPrevNext';
import { useFiles } from './hooks.js';
import { Folder, Pencil, Spinner } from './icons';
import * as styles from './page.css';
import { parseContent } from './parseContent';
import { StaticTree } from './Tree.jsx';

/**
 * Fetch content
 * https://developers.google.com/drive/api/reference/rest/v3/files/export
 */
const fetchContent = async ({ id, mimeType }: { id: string; mimeType: DriveMimeType | undefined }) => {
  if (mimeType === 'application/vnd.google-apps.folder') return;
  if (mimeType === 'application/vnd.google-apps.document') {
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
  }
  return;
};

/**
 * Fetch file
 * https://developers.google.com/drive/api/reference/rest/v3/files/get
 */
const fetchFile = async ({ id }: { id: string }) => {
  const response = await gapi.client.request({
    path: `https://www.googleapis.com/drive/v3/files/${id}`,
    params: {
      fields: 'id,name,mimeType,iconLink,parents',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    },
  });
  return response.result;
};

const Page = ({ folderId = '', id = '' }) => {
  const { files } = useFiles({ id: folderId });
  const { data: _file, isLoading: isLoadingFile } = useSWR(`/drive/v3/files/${id}`, () => fetchFile({ id }), {
    revalidateOnFocus: true,
  });
  const file = _file?.id === id ? _file : files.find((o) => o.id === id);
  const { data: content, isLoading: isLoadingContent } = useSWR(
    file ? `/drive/v3/files/${id}/export` : null,
    () => fetchContent({ id, mimeType: file?.mimeType }),
    {
      revalidateOnFocus: true,
    }
  );

  const loading = isLoadingFile || isLoadingContent;

  const children =
    file && file.mimeType === 'application/vnd.google-apps.folder'
      ? files.filter((o) => o.parents?.[0] === file.id)
      : [];

  const { prev, next } = getPrevNext({ file, files, id });
  const setLocation = useLocation()[1];

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    const cb = (event: KeyboardEvent) => {
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
    <div className={styles.page}>
      {file?.mimeType === 'application/vnd.google-apps.folder' && (
        <a target="_blank" className={styles.button} href={`https://drive.google.com/drive/folders/${file.id}`}>
          <Folder /> View in Drive
        </a>
      )}
      {file?.mimeType === 'application/vnd.google-apps.document' && (
        <a target="_blank" className={styles.button} href={`https://docs.google.com/document/d/${file.id}/edit`}>
          <Pencil /> Edit
        </a>
      )}
      <h1>{file?.name}</h1>
      <div>
        {loading ? <Spinner /> : null}
        {content ? <div dangerouslySetInnerHTML={{ __html: content }} /> : ''}
      </div>
      {file?.mimeType === 'application/vnd.google-apps.folder' && <StaticTree folderId={folderId} files={children} />}
      <div>
        {prev && <Link href={`/${folderId}/${prev.id}`}>← {prev.name}</Link>}
        {prev && next && <span style={{ color: '#646cff' }}> | </span>}
        {next && <Link href={`/${folderId}/${next.id}`}>{next.name} →</Link>}
      </div>
    </div>
  );
};

export default Page;
