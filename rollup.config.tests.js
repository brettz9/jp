import buble from 'rollup-plugin-buble';
import multiEntry from 'rollup-plugin-multi-entry';
import async from 'rollup-plugin-async';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: 'test/**/*.test.js',
  plugins: [async(), buble({
    transforms: {
      generator: false
    }
  }), multiEntry()],
  output: {
    format: 'umd',
    file: 'build/tests-bundle.js',
    name: 'tests',
    sourcemap: true,
    globals: {
      mocha: 'mocha',
      chai: 'chai'
    },
    intro: 'if (typeof module !== "undefined") require("source-map-support").install();'
  },
  external: ['mocha', 'chai']
};
