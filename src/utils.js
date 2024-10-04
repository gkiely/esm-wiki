import { createRoot } from 'react-dom/client';

const toCamelCase = (str = '') => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * @param {import('react').FC} Component
 * @param {string} name
 */
export const createWebComponent = (Component, name) => {
  class WebComponent extends HTMLElement {
    shadowRoot = this.attachShadow({ mode: 'open' });
    constructor() {
      super();
      const shadowRoot = this.shadowRoot;
      // Get all node attributes and pass them as props to component
      const props = Array.from(this.attributes).reduce(
        (acc, { name, value }) => {
          acc[toCamelCase(name)] = value;
          return acc;
        },
        /** @type Record<string, string> */ ({})
      );

      createRoot(shadowRoot).render(<Component {...props} />);
    }
    /**
     *
     * @param {string} _
     * @param {unknown} oldValue
     * @param {unknown} newValue
     */
    attributeChangedCallback(_, oldValue, newValue) {
      if (oldValue !== newValue) {
        const props = Array.from(this.attributes).reduce(
          (acc, { name, value }) => {
            acc[toCamelCase(name)] = value;
            return acc;
          },
          /** @type Record<string, string> */ ({})
        );
        createRoot(this.shadowRoot).render(<Component {...props} />);
      }
    }
  }
  if (!customElements.get(name)) {
    customElements.define(name, WebComponent);
  }
};
