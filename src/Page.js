import { useState, useEffect, useCallback } from 'https://esm.sh/preact/hooks';
import { html } from 'https://esm.sh/htm/preact';
import { filesSignal } from './signals.js';
import { StaticTree } from './Tree.js';
import { Link, useLocation } from 'https://esm.sh/wouter-preact';
import { Folder, Pencil, Spinner } from './icons.js';
import { getPrevNext } from './getPrevNext.js';
import { parseContent } from './parseContent.js';

// @TODO: Fetch content
// @TODO: parse response
// https://developers.google.com/drive/api/reference/rest/v3/files/export

// @TODO: Fetch file
// https://developers.google.com/drive/api/reference/rest/v3/files/get

const Page = ({ folderId = '', id = '' }) => {
  const [content, setContent] = useState('');
  const [, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const files = filesSignal.value;

  /**
   * Fetch file
   * @type {[DriveFile | undefined, (value: DriveFile) => void]}
   */
  const [file, setFile] = useState();

  // @TODO: make request with useEffect
  useEffect(() => {}, []);

  // @TODO: Folder view
  // const children =
  //   file && file.mimeType === 'application/vnd.google-apps.folder'
  //     ? files.filter((o) => o.parents?.[0] === file.id)
  //     : [];

  // Static content
  return html`
    <div class="Page">
      ${file?.mimeType === 'application/vnd.google-apps.folder' && html`<a target="_blank" class="button" href="https://drive.google.com/drive/folders/${file.id}"><${Folder} /> View in Drive</a>`}
      ${file?.mimeType === 'application/vnd.google-apps.document' && html`<a target="_blank" class="button" href="https://docs.google.com/document/d/${file.id}/edit"><${Pencil} /> Edit</a>`}
      <h1>${file?.name}</h1>
      <p class="content">
        ${loading ? html`<${Spinner} />` : ''}
        ${content ? html`<div dangerouslySetInnerHTML=${{ __html: content }}></div>` : ''}
      </p>
      ${
        '' /*
      // @TODO: Folder view
      ${file?.mimeType === 'application/vnd.google-apps.folder' && html`<${StaticTree} folderId=${folderId} files=${children} />`}      
      // @TODO: Prev/Next
      <div class="nav">
        ${prev && html`<${Link} href="/${folderId}/${prev.id}">← ${prev.name}</${Link}>`}
        ${prev && next && html`<span style="color: #646cff"> | </span>`}
        ${next && html`<${Link} href="/${folderId}/${next.id}">${next.name} →</${Link}>`}
      </div>
      */
      }
    </div>
  `;
};

export default Page;
