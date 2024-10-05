import { type Middleware, mutate, type SWRHook } from 'swr/_internal';
import * as DriveAPI from './DriveAPI';
import { generateQuery } from './generateQuery';
import { log } from './logger';
import { concatTo, getId, invariant } from './utils';

async function* getFiles(
  query: string | string[],
  email: string | undefined,
  totalFiles: DriveFile[] = []
): AsyncGenerator<DriveFile[], DriveFile[], unknown> {
  if (typeof query === 'string') {
    const children: DriveFile[] = [];
    const q = query.includes('or') ? `(${query})` : query;
    for await (const files of DriveAPI.listStream({ query: q })) {
      concatTo(children, files);
      yield files;
    }
    void mutate(`${prefix}${query}`, children, false);
    const filteredChildren = children.filter((file) => !totalFiles.some((f) => f.id === getId(file)));
    const nextQuery = generateQuery(filteredChildren, email);
    if (!nextQuery) return children;
    concatTo(totalFiles, children);
    return yield* getFiles(nextQuery, email, totalFiles);
  }

  const children = await Promise.all(query.map((q) => DriveAPI.list({ query: q }))).then((o) => o.flat());
  yield children;
  const filteredChildren = children.filter((file) => !totalFiles.some((f) => f.id === getId(file)));
  const nextQuery = generateQuery(filteredChildren, email);
  if (!nextQuery) return children;
  concatTo(totalFiles, children);
  return yield* getFiles(nextQuery, email, totalFiles);
}

const prefix = '/drive/v3/files?q=';
/**
 * Fetches all files recursively for a given folder
 */
export const recursiveFetch: Middleware = (useSWRNext: SWRHook) => (keyObj, stream, config) => {
  type Result = ReturnType<NonNullable<typeof stream>>;
  const extendedFetcher = async ({ id, email, key }: { key: string; id: string; email: string | undefined }) => {
    const result: DriveFile[] = [];
    const query = `'${id}' in parents`;
    for await (const files of getFiles(query, email)) {
      concatTo(result, files);
      try {
        void stream?.(files);
      } catch {
        log.info('fetch aborted:', id, key);
        return Promise.reject(new Error('Stopped'));
      }
    }
    return result as Result;
  };

  if (keyObj) {
    invariant(typeof keyObj === 'object' && 'key' in keyObj, 'Invalid key');
  }
  const k =
    keyObj && typeof keyObj === 'object' && 'key' in keyObj && typeof keyObj.key === 'string' ? keyObj.key : keyObj;
  return useSWRNext(k, () => extendedFetcher(keyObj as Parameters<typeof extendedFetcher>[0]), config);
};
