'use client';

import katex from 'katex';
import { useMemo } from 'react';

export default function MathFormula({ expression }) {
  const html = useMemo(() => katex.renderToString(expression, { throwOnError: false }), [expression]);
  return <span aria-label={`Formula: ${expression}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
