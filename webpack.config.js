const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
let mode = 'development';
if (process.env.NODE_ENV.trim() === 'production') {
    mode = 'production';
}

console.log(mode + ' mode');

module.exports = {
    mode: mode,
    entry: {bundle: './src/index.js'},
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        open: true,
        static: {
            directory: './src',
            watch: true,
        },
    },
    devtool: 'source-map',
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: mode === 'development',
        }),
        new SVGSpritemapPlugin('./src/assets/sprites/*.svg', {
            output: {
                filename: 'sprite.svg',
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: (name) => {
                        /**
                         * @description Remove first & last item from ${path} array.
                         * @example
                         *      Orginal Path: 'src/images/avatar/image.jpg'
                         *      Changed To: 'images/avatar'
                         */
                        const path = name.filename.split('/').slice(1, -1).join('/');
                        return `${ path }/[name][ext]`;
                    },
                },
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/js'),
            vue: "vue/dist/vue.esm-bundler.js"
        }
    }
};
