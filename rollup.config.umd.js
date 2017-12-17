import config from './rollup.config';

config.output.format = 'umd';
config.output.file = 'dist/JSONP.umd.js';
config.output.name = 'JSONP';

export default config;
