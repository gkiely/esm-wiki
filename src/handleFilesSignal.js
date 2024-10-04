import { filesSignal } from './signals';

/** @type import('swr/_internal').Middleware */
export const handleFilesSignal = (useSWRNext) => (key, fetcher, config) => {
  // const cache = useSWRConfig().cache;

  /**
   * @param {string[]} args
   */
  const extendedFetcher = async (...args) => {
    const id = args[0];
    if (!id) throw new Error('id is required');
    if (!fetcher) throw new Error('fetcher is required');

    const result = await fetcher(...args);
    /** @type any */
    const _result = result;
    /** @type DriveFile[] */
    const files = _result;

    filesSignal.value = [...(filesSignal.value || []), ...files];
    return result;
  };

  return useSWRNext(key, extendedFetcher, config);
};
