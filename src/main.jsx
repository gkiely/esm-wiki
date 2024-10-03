import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { useRoute } from 'wouter-preact';
// import { CacheContext } from 'preact-fetching';
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

// console.log('map', map);

// const map = new Map();

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useRoute('/:folderId/:id?')[1] || {
    folderId: '1NqCSiMuEfPfaHTumR_rX6J8zo7ygjx8q',
    id: '1NqCSiMuEfPfaHTumR_rX6J8zo7ygjx8q',
  };

  useEffect(() => {
    gapi_loaded.promise.then(() => setLoading(false));
    gapi_loaded.promise.catch((err) => setError(err));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // console.log('map', map);

  return (
    // <CacheContext.Provider value={map}>
    <div className="wrapper">
      {params.id && params.folderId && <Tree folderId={params?.folderId} id={params?.id} />}
      <Page folderId={params?.folderId} id={params?.id} />
    </div>
    // </CacheContext.Provider>
  );
};

render(<Main />, document.body);
