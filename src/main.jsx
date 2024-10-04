import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SWRConfig } from 'swr';
import { useRoute } from 'wouter';
import { defaultParams } from './constants';
import { Spinner } from './icons';
import Page from './Page';
import Tree from './Tree';
// import { DEV, host, protocol } from './constants';

// const cacheKey = 'wiki';
// const isHttpDev = DEV && protocol === 'http:' && host !== 'localhost';
// const cache = isHttpDev
//   ? { match: () => ({ json: () => {} }), put: () => {}, delete: () => {} }
//   : await caches.open('app');

// // cache.delete(cacheKey);
// const cachedData = await cache.match(cacheKey);
// const map = cachedData ? new Map(await cachedData.json()) : new Map();
// const saveCache = async () => {
//   cache.put(cacheKey, new Response(JSON.stringify([...map])));
// };
// window.addEventListener('beforeunload', saveCache);

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useRoute('/:folderId/:id?')[1] ?? defaultParams;

  useEffect(() => {
    gapi_loaded.promise.then(() => setLoading(false));
    gapi_loaded.promise.catch((err) => setError(err));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <SWRConfig
      value={{
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
  root.render(<Main />);
}

// const Time = ({ startTime = new Date().toLocaleString() }) => {
//   const [time, setTime] = useState(startTime);
//   setInterval(() => {
//     setTime(new Date().toLocaleTimeString());
//   }, 1000);
//   return <h1>{time}</h1>;
// };

// createWebComponent(Time, 'wc-time');

export default Main;
