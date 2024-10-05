import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

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

declare module 'bun:test' {
  interface Matchers<T> extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchers extends TestingLibraryMatchers {}
}

declare global {
  interface String {
    replace(
      searchValue: string | RegExp,
      replaceValue: string | ((substring: string, ...args: string[]) => string)
    ): string;
  }
}
