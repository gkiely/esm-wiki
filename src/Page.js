import { useState, useEffect } from 'https://esm.sh/preact/hooks';
// import { useState } from 'https://esm.sh/preact/hooks';
import register from 'https://esm.sh/preact-custom-element';
import { html } from 'https://esm.sh/htm/preact';

const Page = () => {
  // 4. Fetch content

  // 1. Static content
  return html`
    <div class="Page">
      <h1>Page title</h1>
      <p class="content">
        Here is my google docs content
      </p>
    </div>
  `;
};

register(Page, 'app-page', [], { shadow: false });
