import { Link } from 'wouter';
import { useFiles } from './hooks';
import { Document, Folder } from './icons';

const getIcon = (mimeType = '', iconLink = '') => {
  if (mimeType === 'application/vnd.google-apps.folder') return <Folder />;
  if (mimeType === 'application/vnd.google-apps.document') return <Document />;
  return iconLink ? (
    <img src={iconLink.replace('16', '32')} alt={mimeType} style={{ width: '1rem', height: '1rem' }} />
  ) : null;
};

const Tree = ({
  id,
  folderId,
  rootFolderId = folderId,
  files,
}: { id: string; folderId: string; rootFolderId?: string; files: DriveFile[] }) => {
  const children = files.filter((file) => file.parents?.includes(folderId));
  return (
    <ul>
      {rootFolderId === folderId ? (
        <li>
          <Link href={`/${folderId}/${folderId}`} style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            🏠 Home
          </Link>
        </li>
      ) : null}
      {children?.map((file) => {
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
              <Tree id={id} folderId={file.id} rootFolderId={rootFolderId} files={files} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

const TreeContainer = ({ id, folderId }: { id: string; folderId: string; rootFolderId?: string }) => {
  const { files } = useFiles({ id: folderId });
  if (!files) return null;
  return <Tree id={id} folderId={folderId} files={files} />;
};

export const StaticTree = ({ files, folderId }: { files: DriveFile[]; folderId: string }) => {
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

export default TreeContainer;
