const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: "./index.js",
	mode: "development",
	output: {
		filename: '[hash].chunk.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: "inline-source-map", // 开启 JS 的 sourceMap
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true, // 开启 gzip 压缩
		hot: true,
		overlay: true, // 编译出错的时候在浏览器页面上显示错误
		open: true,
		publicPath: '/',
		host: 'localhost', // 即 127.0.0.1 ，只能在本地访问
		port: '8066',
		stats: "errors-only" // webpack 编译时会输出大量信息，这边只保留错误信息
	},
	plugins: [
		// 使用 webpack-dev-server 的情况下不能用
		// new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			// HTML title 标签的内容
			title: "mini-vue",
			// 最终生成的文件名
			// devServer 会自动找 dist 目录下的 index.html
			// 如果是其他文件名则需要访问对应的路径
			// 例如：localhost:8066/main.html
			filename: "index.html",
			minify: { // 压缩选项
				// collapseWhitespace: true, // 移除空格
				// removeComments: true, // 移除注释
				// removeAttributeQuotes: true, // 移除双引号
			}
		}),
		new webpack.HotModuleReplacementPlugin()
	]
}