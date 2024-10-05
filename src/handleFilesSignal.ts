// import { Middleware } from 'swr';
// import { filesSignal } from './signals';

// export const handleFilesSignal: Middleware = (useSWRNext) => (key, fetcher, config) => {
//   // const cache = useSWRConfig().cache;
//   const extendedFetcher = async (...args: string[]) => {
//     const id = args[0];
//     if (!id) throw new Error('id is required');
//     if (!fetcher) throw new Error('fetcher is required');

//     const result = await fetcher(...args);
//     const files = result as DriveFile[];

//     filesSignal.value = [...(filesSignal.value || []), ...files];
//     return result;
//   };

//   return useSWRNext(key, extendedFetcher, config);
// };
