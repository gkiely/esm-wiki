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

export {};
