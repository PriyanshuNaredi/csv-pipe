/// <reference types="vite/client" />

// Lets TypeScript resolve single-file component imports in the docs theme.
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    unknown
  >;
  export default component;
}
