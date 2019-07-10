import pkg from './package.json';
import { terser } from "rollup-plugin-terser";
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
export default {
  input: './index.js', // our source file
  output: [
    {
      file: 'dist/bundle.js',
      format: 'umd',
      name: 'commit-standardizer'
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {})
  ],
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      preferBuiltins: true,
    }),
    commonjs({
      include: 'node_modules/**',  // Default: undefined
      exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined
      extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]
      ignoreGlobal: false,  // Default: false
      sourceMap: false,  // Default: true
      namedExports: { './module.js': ['foo', 'bar' ] },  // Default: undefined
      ignore: [ 'conditional-runtime-dependency' ],
    })
  ]
};