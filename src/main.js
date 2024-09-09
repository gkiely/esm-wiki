import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import register from 'https://esm.sh/preact-custom-element';
import { html } from 'https://esm.sh/htm/preact';
import { useRoute } from 'https://esm.sh/wouter-preact';
import Page from './Page.js';
import Tree from './Tree.js';

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useRoute('/:folderId/:id?')[1];

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

register(Main, 'app-main', [], { shadow: false });
