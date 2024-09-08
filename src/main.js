import { useState, useEffect } from 'https://esm.sh/preact/hooks';
import register from 'https://esm.sh/preact-custom-element';
import { html } from 'https://esm.sh/htm/preact';
// import './Tree.js';
import './Page.js';

const Main = () => {
  // 4. Wait for gapi_loaded promise
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    gapi_loaded.promise.then(() => setLoading(false));
    gapi_loaded.promise.catch((err) => setError(err));
  }, []);

  if (loading) return html`<div>Loading...</div>`;
  if (error) return html`<div>Error: ${error}</div>`;

  return html`      
    <div>
      <app-page></app-page>
    </div>
  `;
};

register(Main, 'app-main', [], { shadow: false });
