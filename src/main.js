import { render } from 'https://esm.sh/preact';
import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import { html } from 'https://esm.sh/htm/preact';
import { useRoute } from 'https://esm.sh/wouter-preact';
import Page from './Page.js';
import Tree from './Tree.js';

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useRoute('/:folderId/:id?')[1] || {
    folderId: '1NqCSiMuEfPfaHTumR_rX6J8zo7ygjx8q',
    id: '1VDTyWNVCspD2mMC-IQQUtgf8HyLUe37C6G87TheqJhI',
  };

  useEffect(() => {
    gapi_loaded.promise.then(() => setLoading(false));
    gapi_loaded.promise.catch((err) => setError(err));
  }, []);

  if (loading) return html`<div>Loading...</div>`;
  if (error) return html`<div>Error: ${error}</div>`;

  return html`
    <div class="wrapper">
      <${Tree} folderId=${params?.folderId} id=${params?.id} />
      <${Page} folderId=${params?.folderId} id=${params?.id} />
    </div>
  `;
};

render(html`<${Main} />`, document.body);
