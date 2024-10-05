import { listFields } from './constants';
import { log } from './logger';

export const list = async ({
  query,
  fields = listFields,
  orderBy = 'folder,name_natural',
  pageSize = 1000,
  trashed = false,
  driveId,
  nextPageToken,
}: {
  query: string;
  fields?: string;
  orderBy?: 'folder,name_natural';
  pageSize?: number;
  trashed?: boolean;
  driveId?: string | undefined;
  nextPageToken?: string;
}): Promise<DriveFile[]> => {
  const q = `${query} and trashed = ${trashed}`;
  log.info('list:', q);
  const { result } = await gapi.client.request({
    path: 'https://www.googleapis.com/drive/v3/files',
    params: {
      q,
      fields: `${fields},nextPageToken`,
      pageSize,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      orderBy,
      ...(nextPageToken && { pageToken: nextPageToken }),
      ...(driveId && {
        corpora: 'drive',
        driveId,
      }),
    },
  });
  if (result.nextPageToken) {
    const files = await list({
      query,
      fields,
      orderBy,
      pageSize,
      trashed,
      driveId,
      nextPageToken: result.nextPageToken,
    });

    // It's possible for Drive to return a duplicate file in the next page as the first entry
    // This removes the duplicate
    if (files.at(0)?.id === result.files.at(-1)?.id) {
      return result.files.concat(files.slice(1));
    }
    return result.files.concat(files);
  }
  return result.files;
};

export async function* listStream({
  query,
  fields = listFields,
  orderBy = 'folder,name_natural',
  pageSize = 1000,
  trashed = false,
  driveId,
  nextPageToken,
}: {
  query: string;
  fields?: string;
  orderBy?: 'folder,name_natural';
  pageSize?: number;
  trashed?: boolean;
  driveId?: string | undefined;
  nextPageToken?: string;
}): AsyncGenerator<DriveFile[], void, unknown> {
  const q = `${query} and trashed = ${trashed}`;
  log.info('listStream:', q);
  const { result } = await gapi.client.request({
    path: 'https://www.googleapis.com/drive/v3/files',
    params: {
      q,
      fields: `${fields},nextPageToken`,
      pageSize,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      orderBy,
      ...(nextPageToken && { pageToken: nextPageToken }),
      ...(driveId && {
        corpora: 'drive',
        driveId,
      }),
    },
  });
  if (result.nextPageToken) {
    yield result.files;
    const filesStream = listStream({
      query,
      fields,
      orderBy,
      pageSize,
      trashed,
      driveId,
      nextPageToken: result.nextPageToken,
    });

    // It's possible for Drive to return a duplicate file in the next page as the first entry
    // This removes the duplicate
    for await (const files of filesStream) {
      if (files.at(0)?.id === result.files.at(-1)?.id) {
        yield files.slice(1);
      } else {
        yield files;
      }
    }
    return;
  }
  yield result.files;
}
