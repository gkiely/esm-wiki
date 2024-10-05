import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { type Cache, SWRConfig } from 'swr';
import { useRoute } from 'wouter';
import Page from './Page';
import Tree from './Tree';
import { DEV, debug, defaultParams, host, protocol } from './constants';
import { Spinner } from './icons';

const createCacheProvider = async () => {
  const cacheKey = 'wiki';
  const isHttpDev = DEV && protocol === 'http:' && host !== 'localhost';
  const cache = isHttpDev
    ? { match: () => ({ json: () => {} }), put: () => {}, delete: () => {} }
    : await caches.open('app');

  if (debug) {
    await cache.delete(cacheKey);
  }
  const cachedData = await cache.match(cacheKey);
  const map = cachedData ? new Map(await cachedData.json()) : new Map();
  const saveCache = async () => {
    await cache.put(cacheKey, new Response(JSON.stringify([...map])));
  };
  window.addEventListener('beforeunload', saveCache);
  if (DEV) window.cache = map;
  return () => map as Cache;
};

const cacheProvider = typeof window.caches === 'undefined' ? undefined : await createCacheProvider();

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useRoute('/:folderId/:id?')[1] ?? defaultParams;

  useEffect(() => {
    gapi_loaded.promise.then(() => setLoading(false)).catch((err) => setError(err));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <SWRConfig
      value={{
        ...(cacheProvider && { provider: cacheProvider }),
        revalidateOnMount: true,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        focusThrottleInterval: 1000,
      }}
    >
      <div className="wrapper">
        {params?.id && <Tree folderId={params?.folderId} id={params?.id} />}
        <Page folderId={params?.folderId} id={params?.id} />
      </div>
    </SWRConfig>
  );
};

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');
if (import.meta.env.PROD || (import.meta.env.DEV && rootEl.innerHTML === '')) {
  const root = createRoot(rootEl);
  root.render(
    <StrictMode>
      <Main />
    </StrictMode>
  );
}

export default Main;
