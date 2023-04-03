const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = () => {
    return {
        entry: './src/index.js', // 入口文件
        devServer: { // 测试环境服务
            open: true,
            port: 3000
        },
        output: { // 打包输出的地方
            chunkFilename: isProduction ? '[name]@[chunkhash:8].chunk.js' : '[name].chunk.js',
            filename: isProduction ? '[name]@[contenthash].js' : '[name].js',
        },
        mode: isProduction ? 'production' : 'development',
        module: {
            rules: [
                {
                    // .js文件loader
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false
                        }
                    }
                },
                {
                    // .vue文件loader
                    test: /\.vue$/,
                    use: 'vue-loader'
                },
                {
                    // .css 文件loader
                    test: /\.css$/,
                    use: [isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader', 'css-loader'] 
                },
                {
                    // .less 文件loader
                    test: /\.less$/i,
                    use: [isProduction ? MiniCssExtractPlugin.loader: 'vue-style-loader', 'css-loader', 'less-loader']
                }
            ]
        },
        resolve: { // 设置模块如何被解析
            alias: {
                vue$: 'vue/dist/vue.runtime.esm-bundler.js' // import Vue from 'vue' 使用的文件，$表示精确匹配
            },
            extensions: ['.js', '.vue'] // 按顺序解析这些后缀名
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: 'index.html'
            }),
            isProduction ? new MiniCssExtractPlugin({
                filename: '[name].[contenthash:8].css',
                chunkFilename: '[name].[contenthash:8].chunk.css'
            }): null,
        ].filter(Boolean)
    };
};