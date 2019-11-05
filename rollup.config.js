import babel from 'rollup-plugin-babel';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: 'src/index.js',
  plugins: [babel()],
  output: {sourcemap: true}
};
