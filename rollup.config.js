import pkg from './package.json';
import { terser } from "rollup-plugin-terser";

export default {
  input: './index.js', // our source file
  output: [
    {
      file: 'dist/index.js',
      format: 'iife',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {})
  ],
  plugins: [
    terser()
  ]
};