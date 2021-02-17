var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var minimize = process.argv.indexOf('--minimize') !== -1;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
	devtool: 'eval',
	entry: {
		OwlCarousel: './components/OwlCarousel.jsx'
	},
	resolve: {
		extensions: ["", ".jsx", ".js"],
	},
	output: {
		path: path.join(__dirname, "lib"),
		filename: "[name].js",
		library: ["react-owl-carousel2fix"],
		libraryTarget: "umd"
	},
	externals: {
		'react': {
			root: 'React',
			commonjs2: 'react',
			commonjs: 'react',
			amd: 'react'
		},
		'react-dom': {
			root: 'ReactDOM',
			commonjs2: 'react-dom',
			commonjs: 'react-dom',
			amd: 'react-dom'
		},
		'prop-types': {
			root: 'PropTypes',
			commonjs2: 'prop-types',
			commonjs: 'prop-types',
			amd: 'prop-types'
		},
	},
	plugins: [
		new ExtractTextPlugin('styles.css'),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.DedupePlugin(),
	],
	module: {
		loaders: [
			{
				test: /\.(js|jsx)$/,
				loaders: ['babel'],
				include: [path.join(__dirname, 'components'), path.join(__dirname, 'src')],
				exclude: path.join(__dirname, 'node_modules'),
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract(
					'style-loader',
					'css-loader',
					'postcss-loader'
				),
			},
		],

		noParse: [],
	},
	postcss: function () {
		return [autoprefixer];
	},
};

if (minimize) {
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		})
	);
	config.devtool = 'source-map';
	config.output.filename = "[name].min.js";
}

module.exports = config;
