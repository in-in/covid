const { join } = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const common = require('./webpack.config');
const { PATHS } = require('./paths');

const styles = {
	'test': /\.scss$/,
	'use': [
		MiniCssExtractPlugin.loader,
		'css-loader',
		{
			'loader': 'postcss-loader',
			'options': {
				'postcssOptions': {
					'config': PATHS.config,
				},
			},
		},
		{
			'loader': 'sass-loader',
			'options': {
				'sassOptions': {
					'includePaths': [
						PATHS.components,
						PATHS.styles,
						join(PATHS.tokens, 'build'),
					],
				},
			},
		},
	],
};

const images = {
	'test': /\.(png|jpe?g|webp)$/i,
	'use': [
		{
			'loader': 'image-webpack-loader',
			'options': {
				'mozjpeg': {
					'progressive': true,
					'quality': 80,
				},
				'optipng': {
					'enabled': false,
				},
				'pngquant': {
					'quality': [0.8, 0.85],
					'speed': 4,
				},
				'webp': {
					'quality': 75,
				},
			},
		},
	],
};

const config = {
	'mode': 'production',
	'output': {
		'filename': '[name].[contenthash].js',
		'path': PATHS.dist,
		'publicPath': '',
	},
	'optimization': {
		'splitChunks': {
			'cacheGroups': {
				'inline': {
					'name': (module, chunks, cacheGroupKey) => cacheGroupKey,
					'test': /inline.scss$/,
					'chunks': 'all',
					'enforce': true,
				},
				'styles': {
					'name': (module, chunks, cacheGroupKey) => cacheGroupKey,
					'test': /style.scss$/,
					'chunks': 'all',
					'enforce': true,
				},
			},
		},
	},
	'plugins': [
		new HtmlWebpackInlineSVGPlugin({
			'runPreEmit': true,
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			'filename': '[name].[contenthash].css',
		}),
		new CssoWebpackPlugin(),
	],
	'module': {
		'rules': [
			styles,
			images,
		],
	},
};

module.exports = merge(common, config);
