// Web components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wc-time': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'start-time'?: string;
      };
    }
  }
}

// Add window.cache
declare global {
  interface Window {
    cache: Map<unknown, unknown>;
  }
}

export {};
