const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Configure plugins loaded based on environment.
 */
const plugins = [
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
    }),
];


if (IS_PRODUCTION) {
    plugins.push(
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
            },
        })
    );
}

module.exports = {
    entry: {
        "game-2018": [
            "./app-2018/scripts.ts"
        ]
    },

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../game-server-2018/public/bundle"),
    },

    resolve: {
        extensions: [ ".js", ".jsx", ".ts", ".tsx", ".scss" ],
    },

    devtool: IS_PRODUCTION ? false : "inline-source-map",

    module: {
        rules: [
            {
              test: /\.scss$/,
              use: [
                {
                  loader: IS_PRODUCTION ? MiniCssExtractPlugin.loader : "style-loader",
                },
                "css-loader",
                "sass-loader"
              ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: "../app-2018/tsconfig.json"
                        }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|jpg|png)$/,
                use: [
                    {
                      loader: 'file-loader',
                      options: {}
                    }
                ]
            }
        ],
    },
    plugins,
    optimization: {
        minimize: IS_PRODUCTION,
    },
    mode: IS_PRODUCTION ? "production" : "development"
};
