import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { uglify } from 'rollup-plugin-uglify';
import banner from 'rollup-plugin-banner';

const hybanner = banner('hyperform.js.org');

export default [{
  input: 'src/hyperform.js',
  output: [
    {
      file: 'dist/hyperform.js',
      format: 'iife',
      name: 'hyperform',
      plugins: [hybanner],
    },
    {
      file: 'dist/hyperform.min.js',
      format: 'iife',
      name: 'hyperform',
      plugins: [uglify(), hybanner],
    },
    {
      file: 'dist/hyperform.cjs.js',
      format: 'cjs',
      plugins: [hybanner],
    },
    {
      file: 'dist/hyperform.cjs.min.js',
      format: 'cjs',
      plugins: [uglify(), hybanner],
    },
    {
      file: 'dist/hyperform.amd.js',
      format: 'amd',
      plugins: [hybanner],
    },
    {
      file: 'dist/hyperform.amd.min.js',
      format: 'amd',
      plugins: [uglify(), hybanner],
    },
    {
      file: 'dist/hyperform.esm.js',
      format: 'esm',
      plugins: [hybanner],
    },
    {
      file: 'dist/hyperform.esm.min.js',
      format: 'esm',
      plugins: [terser({
        module: true,
      }), hybanner],
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
  ],
}];
