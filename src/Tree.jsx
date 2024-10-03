import { Link } from 'wouter-preact';
import { filesSignal } from './signals.js';
import { Document, Folder } from './icons.js';
import { useQuery } from 'preact-fetching';

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
    return <Folder />;
  }

  if (mimeType === 'application/vnd.google-apps.document') {
    return <Document />;
  }

  return iconLink ? <img src={iconLink.replace('16', '32')} alt={mimeType} style="width: 1rem; height: 1rem;" /> : null;
};

/**
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.folderId
 * @param {string} [props.rootFolderId]
 */
const Tree = ({ id = '', folderId = '', rootFolderId = folderId }) => {
  const { data: files } = useQuery(`/drive/v3/files?q='${folderId}' in parents`, async () => {
    const files = (await fetchFiles(folderId)).filter((file) => file.name !== 'wiki.logo' && file.name !== 'wiki.page');
    filesSignal.value = [...filesSignal.value, ...files];
    return files;
  });

  return (
    <ul>
      {rootFolderId === folderId ? (
        <li>
          <Link href={`/${folderId}/${folderId}`} style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            🏠 Home
          </Link>
        </li>
      ) : null}
      {files?.map((file) => {
        return (
          <li key={file.id}>
            <Link
              aria-current="page"
              href={`/${rootFolderId}/${file.id}`}
              style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}
            >
              {getIcon(file.mimeType, file.iconLink)}
              {file.id === id ? <strong>{file.name}</strong> : file.name}
            </Link>
            {file.mimeType === 'application/vnd.google-apps.folder' ? (
              <Tree id={id} folderId={file.id} rootFolderId={rootFolderId} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

/**
 * @param {object} props
 * @param {DriveFile[]} props.files
 * @param {string} props.folderId
 * @returns
 */
export const StaticTree = ({ files, folderId }) => {
  return (
    <ul>
      {files?.map((file) => {
        return (
          <li key={file.id}>
            <Link href={`/${folderId}/${file.id}`} style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              {getIcon(file.mimeType, file.iconLink)}
              {file.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Tree;
