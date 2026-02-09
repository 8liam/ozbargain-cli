#!/usr/bin/env node

import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, chmodSync } from 'fs';

async function build() {
  mkdirSync('dist', { recursive: true });

  await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile: 'dist/bundle.js',
    format: 'esm',
    loader: { '.js': 'jsx' },
    jsx: 'automatic',
    external: ['ink', 'react', 'react/jsx-runtime', 'rss-parser', 'child_process', 'ink-gradient', 'ink-spinner'],
  });

  let code = readFileSync('dist/bundle.js', 'utf-8');
  code = code.replace(/^#![^\n]*\n/, '');
  code = '#!/usr/bin/env node\n' + code;
  writeFileSync('dist/bundle.js', code);
  chmodSync('dist/bundle.js', 0o755);
  console.log('✓ Built');
}

build().catch(console.error);
