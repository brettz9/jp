import buble from 'rollup-plugin-buble';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: 'src/index.js',
  plugins: [buble()],
  output: {sourcemap: true}
};
