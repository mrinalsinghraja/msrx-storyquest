import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

/**
 * eslint-config-next already ships a flat config array, so it is spread in
 * directly. Wrapping it in FlatCompat throws on ESLint 9.
 */
const config = [
  ...nextCoreWebVitals,
  { ignores: ['.next/**', 'node_modules/**'] },
];

export default config;
