import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';

export default [
  // Main bundle
  {
    input: 'src/index.ts',  // Entry point for your components
    output: [
      {
        file: 'dist/index.js',  // CommonJS output
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/esm/index.js',  // ES Modules output
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
      postcss({
        modules: true,
        extract: true,
        minimize: true,
        sourceMap: true,
      }),
      terser(),
    ],
    external: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
  // TypeScript type definitions
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
