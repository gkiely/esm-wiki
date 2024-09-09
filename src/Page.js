import { useState, useEffect } from 'https://esm.sh/preact/hooks';
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

const Page = ({ id = '' }) => {
  // 4.1 Fetch content
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Fetch file
   * @type {[DriveFile | undefined, (value: DriveFile) => void]}
   */
  const [file, setFile] = useState();

  // 5.
  // Edit button
  // Refresh on focus
  useEffect(() => {
    /**
     * Focus event
     * @param {FocusEvent} [e]
     */
    const onFocus = (e) => {
      if (!e) {
        setLoading(true);
      }
      Promise.all([fetchContent({ id }).then(setContent), fetchFile({ id }).then(setFile)])
        .then(() => setLoading(false))
        .catch(setError);
    };
    onFocus();

    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, [id]);

  // 6. Pressing e will open the edit link
  useEffect(() => {
    /**
     * @param {KeyboardEvent} event
     */
    const onKeyDown = (event) => {
      if (event.key === 'e') {
        window.open(`https://docs.google.com/document/d/${id}/edit`, '_blank');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [id]);

  // 1. Static content
  return html`
    <div class="Page">
      <a target="_blank" href="https://docs.google.com/document/d/${id}/edit">Edit</a>
      <h1>${file?.name}</h1>
      <p class="content">
      ${loading ? 'Loading...' : ''}
      ${content ? html`<div dangerouslySetInnerHTML=${{ __html: content }}></div>` : ''}
      </p>
    </div>
  `;
};

export default Page;
