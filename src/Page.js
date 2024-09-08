import { useState, useEffect } from 'https://esm.sh/preact/hooks';
// import { useState } from 'https://esm.sh/preact/hooks';
import register from 'https://esm.sh/preact-custom-element';
import { html } from 'https://esm.sh/htm/preact';

// 4. Fetch content
// https://developers.google.com/drive/api/reference/rest/v3/files/export
const fetchContent = async ({ id = '' }) => {
  const response = await gapi.client.request({
    path: `https://www.googleapis.com/drive/v3/files/${id}/export`,
    params: {
      fields: '*',
      mimeType: 'text/html',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    },
  });

  return response.body;
};

const fetchFile = async ({ id = '' }) => {
  const response = await gapi.client.request({
    path: `https://www.googleapis.com/drive/v3/files/${id}`,
    params: {
      fields: '*',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    },
  });

  return response.result;
};

const Page = () => {
  // 4.1 Fetch content
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  /**
   * Fetch file
   * @type {[{id: string; name: string} | undefined, function]}
   */
  const [file, setFile] = useState();

  useEffect(() => {
    fetchContent({ id: '1VDTyWNVCspD2mMC-IQQUtgf8HyLUe37C6G87TheqJhI' }).then(setContent).catch(setError);
    fetchFile({ id: '1VDTyWNVCspD2mMC-IQQUtgf8HyLUe37C6G87TheqJhI' }).then(setFile).catch(setError);
  }, []);

  // 1. Static content
  return html`
    <div class="Page">
      <h1>${file?.name}</h1>
      <p class="content">
      ${content ? html`<div dangerouslySetInnerHTML=${{ __html: content }}></div>` : ''}
      </p>
    </div>
  `;
};

register(Page, 'app-page', [], { shadow: false });
