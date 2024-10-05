import { getId, isAFolder, isAShortcut } from './utils';

const generateCompoundQuery = (folders: DriveFile[]): string => {
  const ids = folders.map((o) => (isAShortcut(o) ? o.shortcutDetails.targetId : o.id));
  const query = ids.map((id, i) => `'${id}' in parents${i !== ids.length - 1 ? ' or ' : ''}`);
  const q = `${query.join('')}`;
  return q;
};

/**
 * Returns a compound query if possible, otherwise returns a list of queries
 * @param files
 * @param email
 * @param exclude - A list of folder IDs to exclude from the query
 */
export const generateQuery = (files: DriveFile[], email?: string): string | string[] | undefined => {
  const folders = files.filter(isAFolder);

  // If no folders are found, no query is returned
  if (!folders.length) return;

  // If there's only one folder, return simple query
  if (folders.length === 1 && folders[0]) return `'${getId(folders[0])}' in parents`;

  // If there are more than 120 folders, we can't use a compound query
  if (folders.length > 120) return folders.map((o) => `'${getId(o)}' in parents`);

  // If all of the folders are owned by the user, we can use a compound query
  const ownedByMe = folders.some((o) => o.ownedByMe);
  if (ownedByMe) return generateCompoundQuery(folders);

  // If the user has access to all folders, we can use a compound query
  const emailAccess =
    email && folders.every((o) => o.permissions?.some((p) => p.type === 'user' && p.emailAddress === email));
  if (emailAccess) return generateCompoundQuery(folders);

  // If any permissions are missing, we can't use the compound query
  const missingPermission = folders.some((o) => !o.permissions);
  if (missingPermission) return folders.map((o) => `'${getId(o)}' in parents`);

  // If any of the folders are public, we can't use a compound query, as a compound returns partial results for those
  const permissions = folders.flatMap((o) => ('permissions' in o ? o.permissions : []));
  const anyone = permissions.some((o) => o.id === 'anyone' || o.id === 'anyoneWithLink');
  if (anyone) return folders.map((o) => `'${getId(o)}' in parents`);

  // If any of the folder permissions are using group domain sharing, we can't use a compound query
  const groupPermission = permissions.some((p) => p.type === 'domain');
  if (groupPermission) return folders.map((o) => `'${getId(o)}' in parents`);

  if (folders.every((o) => o.permissions)) return generateCompoundQuery(folders);

  // Otherwise use an array of queries
  return folders.map((o) => `'${getId(o)}' in parents`);
};
