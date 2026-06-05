import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'docs/api',
      'docs/.vitepress/cache',
      'docs/.vitepress/dist',
      'coverage',
      'node_modules'
    ]
  },
  ...tseslint.configs.recommended
);
