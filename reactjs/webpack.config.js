// 路徑處理套件
const path = require("path");
// css額外處理套件 (原 extract-text-webpack-plugin 已棄用)
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// production最小化
// Ref: https://github.com/webpack-contrib/mini-css-extract-plugin#minimizing-for-production
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// node內建函數庫替換為瀏覽器版本
var alias = {};

// 通用libs的地方 使用方法: require('libs/js/store'); 類似這樣
// alias.libs = path.join(__dirname, '..', 'assets', 'global', 'libs');

module.exports = {
    mode: "development",
    // mode: "production",
    
    target: "web",
    context: path.join(__dirname, "assets"),
    entry: {
        // "dcc-g": "./dcc-g/index.js",
        "pix2pix": "./pix2pix/index.js",
    },
    
    //輸出格式
    output: {
        path: path.join(__dirname, "public/js"),
        filename: "[name].js",
        libraryTarget: 'this'
    },
    
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                // 不使用這個，直接套用.babelrc
                // options: {
                //     presets: ["@babel/env"] 
                // }
            },
            // Ref: https://webpack.docschina.org/loaders/less-loader/
            {
                test: /\.less$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    // export to JS
                    // {
                    //     loader: "style-loader"
                    // },
                    // export to CSS file
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: "../",
                        }
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "less-loader"
                    }
                ],
            }
        ],
    },
    
    // Ref: https://webpack.docschina.org/plugins/mini-css-extract-plugin/
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "../css/[name].css",
            // chunkFilename: "[id].css"
        })
    ],
    
    resolve: {
        // 不用寫副檔名
        extensions: ['.js', '.jsx', '.css', '.less'],
        // 這個是實際在解決問題的
        alias: alias
    },
    
    // CDN用的
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "jquery": "jQuery",
        "@tensorflow/tfjs": "tf",
        "@tensorflow/tfjs-vis": "tfvis",
    }
};
