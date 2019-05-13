import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default [{
  input: 'src/hyperform.js',
  output: [
    {
      file: 'dist/hyperform.js',
      format: 'iife',
      name: 'hyperform',
    },
    {
      file: 'dist/hyperform.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/hyperform.amd.js',
      format: 'amd',
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
  ],
}];
