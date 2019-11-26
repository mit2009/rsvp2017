const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Configure plugins loaded based on environment.
 */
const plugins = [new CheckerPlugin(), new ExtractTextPlugin('[name].css')];

if (IS_PRODUCTION) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    );
}

module.exports = {
    entry: {
        app: ['./app/app.scss'],
        homepage: ['./app/homepage.tsx'],
        game: ['./app/gamePage.tsx']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './server/public/bundle')
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss']
    },

    devtool: IS_PRODUCTION ? false : 'inline-source-map',

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: './app/tsconfig.json'
                }
            },

            // All files with a '.scss' extension will be handled by 'sass-loader'
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader'
                })
            },

            // All font files will be handled by 'file-loader'
            {
                test: /\.(eot|svg|ttf|woff|woff2|jpg|png)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins
};
