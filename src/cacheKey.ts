// import { Middleware, useSWRConfig } from 'swr';

// export const cacheKey: Middleware = (useSWRNext) => (key, fetcher, config) => {
//   const cache = useSWRConfig().cache;
//   const extendedFetcher = async (args: string[]) => {
//     const id = args[0];
//     const key = args[1];
//     if (!id) throw new Error('id is required');
//     if (!key) throw new Error('key is required');
//     if (!fetcher) throw new Error('fetcher is required');

//     const result = await fetcher(...args);
//     const existingData = cache.get(key);
//     if (Array.isArray(existingData) && Array.isArray(result)) {
//       const data = [...existingData, ...result];
//       cache.set(key, { data });
//     }

//     return result;
//   };

//   return useSWRNext(key, extendedFetcher, config);
// };
