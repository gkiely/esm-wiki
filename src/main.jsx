import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact';
import { useRoute } from 'wouter-preact';
import Page from './Page';
import Tree from './Tree';

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

  if (loading) return html`<div>Loading...</div>`;
  if (error) return html`<div>Error: ${error}</div>`;

  return (
    <div className="wrapper">
      {params.id && params.folderId && <Tree folderId={params?.folderId} id={params?.id} />}
      <Page folderId={params?.folderId} id={params?.id} />
    </div>
  );
};

render(html`<${Main} />`, document.body);
