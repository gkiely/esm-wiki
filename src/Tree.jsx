import useSWR from 'swr';
import { Link } from 'wouter';
import { Document, Folder } from './icons';
import { filesSignal } from './signals';

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

/**
 * @param {string} id
 */
const filesQuery = async (id) => {
  const files = (await fetchFiles(id)).filter((file) => file.name !== 'wiki.logo' && file.name !== 'wiki.page');
  filesSignal.value = [...filesSignal.value, ...files];
  return files;
};

const getIcon = (mimeType = '', iconLink = '') => {
  if (mimeType === 'application/vnd.google-apps.folder') {
    return <Folder />;
  }

  if (mimeType === 'application/vnd.google-apps.document') {
    return <Document />;
  }

  return iconLink ? (
    <img src={iconLink.replace('16', '32')} alt={mimeType} style={{ width: '1rem', height: '1rem' }} />
  ) : null;
};

/**
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.folderId
 * @param {string} [props.rootFolderId]
 */
const Tree = ({ id, folderId, rootFolderId = folderId }) => {
  const { data: files } = useSWR(`/drive/v3/files?q='${folderId}' in parents`, () => filesQuery(folderId));

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

/**
 * A hidden tree to load files without rendering the tree
 * @param {PropsOf<typeof Tree>} props
 */
export const HiddenTree = ({ id, folderId, rootFolderId = folderId }) => {
  const { data: files } = useSWR(`/drive/v3/files?q='${folderId}' in parents`, () => filesQuery(folderId));
  return (
    <>
      {files?.map((file) =>
        file.mimeType === 'application/vnd.google-apps.folder' ? (
          <HiddenTree key={file.id} id={id} folderId={file.id} rootFolderId={rootFolderId} />
        ) : null
      )}
    </>
  );
};

export default Tree;
