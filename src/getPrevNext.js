/**
 * @param {object} props
 * @param {DriveFile | undefined} props.file
 * @param {DriveFile[]} props.files
 * @param {string} props.id
 */
export const getPrevNext = ({ file, files, id }) => {
  const children =
    file && file.mimeType === 'application/vnd.google-apps.folder'
      ? files.filter((o) => o.parents?.[0] === file.id)
      : [];
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

  return { prev, next };
};
