'use strict'
const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        'index': './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../lib'),
        filename: 'index.js',
        library: 'hailuo',
        libraryTarget: 'umd',
        umdNamedDefine: true 
    },
    resolve: {
        extensions: ['js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [path.resolve(__dirname, '../node_modules')],
            },
        ]
    },
    optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all'
            }
          }
        }
    }
};
