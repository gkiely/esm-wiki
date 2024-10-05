import { createElement, FC } from 'react';
import { createRoot } from 'react-dom/client';

const toCamelCase = (str = '') => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

export const createWebComponent = (Component: FC, name: string) => {
  class WebComponent extends HTMLElement {
    shadowRoot = this.attachShadow({ mode: 'open' });
    constructor() {
      super();
      const shadowRoot = this.shadowRoot;
      // Get all node attributes and pass them as props to component
      const props = Array.from(this.attributes).reduce<Record<string, string>>((acc, { name, value }) => {
        acc[toCamelCase(name)] = value;
        return acc;
      }, {});

      createRoot(shadowRoot).render(createElement(Component, props));
    }
    attributeChangedCallback(_: string, oldValue: unknown, newValue: unknown) {
      if (oldValue !== newValue) {
        const props = Array.from(this.attributes).reduce<Record<string, string>>((acc, { name, value }) => {
          acc[toCamelCase(name)] = value;
          return acc;
        }, {});
        createRoot(this.shadowRoot).render(createElement(Component, props));
      }
    }
  }
  if (!customElements.get(name)) {
    customElements.define(name, WebComponent);
  }
};
