import babel from 'rollup-plugin-babel';

export default [{
    input: 'index-es6.js',
    output: {
        file: 'index.js',
        format: 'umd',
        name: 'JSONP'
    },
    plugins: [
        babel()
    ]
}];
