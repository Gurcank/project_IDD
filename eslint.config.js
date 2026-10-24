import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/'] },
  js.configs.recommended,
  {
    files: ['public/assets/iklim-krizi/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      // Loaded as a classic <script>, not a module: top-level names share the
      // page's global scope with the site's own inline scripts.
      sourceType: 'script',
      globals: {
        ...globals.browser,
        // Provided by CDN <script> tags (site master and this page's @push).
        gsap: 'readonly',
        ScrollTrigger: 'readonly',
        Lenis: 'readonly',
        AOS: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { args: 'after-used' }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-implied-eval': 'error',
      'no-eval': 'error',
    },
  },
  {
    files: ['*.js', '*.mjs'],
    languageOptions: { globals: globals.node },
  },
];
