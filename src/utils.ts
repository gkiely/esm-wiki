import { type FC, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { DEV, mimeTypes } from './constants';

export const toCamelCase = (str = '') => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

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

export const concatTo = <T>(a: T[], b: T[] | T): T[] => {
  Array.isArray(b) ? Array.prototype.push.apply(a, b) : Array.prototype.push.call(a, b);
  return a;
};

type Shortcut = Extract<DriveFile, { mimeType: 'application/vnd.google-apps.shortcut' }>;
export const isAShortcut = (file: DriveFile | undefined): file is Shortcut =>
  file ? file.mimeType === mimeTypes.shortcut : false;

export const isAFolder = (file: DriveFile | undefined) =>
  file
    ? file.mimeType === 'application/vnd.google-apps.folder' ||
      (isAShortcut(file) && file.shortcutDetails.targetMimeType === 'application/vnd.google-apps.folder')
    : false;

export const getId = (file: DriveFile) => ('shortcutDetails' in file ? file.shortcutDetails.targetId : file.id);

export function invariant(condition: boolean, message?: string): asserts condition {
  if (DEV) {
    if (!condition) {
      throw new Error(`Assertion failed${message ? `: ${message}` : ''}`);
    }
    return;
  }
  // if (!condition) {
  //   TrackJS.track(`Assertion failed${message ? `: ${message}` : ''}`);
  // }
}
