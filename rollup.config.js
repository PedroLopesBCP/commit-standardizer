import pkg from './package.json';
import { terser } from "rollup-plugin-terser";
import babel from 'rollup-plugin-babel';
export default {
  input: './index.js', // our source file
  output: [
    {
      file: 'dist/bundle.js',
      format: 'umd'
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {})
  ],
  plugins: [
    terser(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};