const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const common = require('./webpack.config');
const { PATHS, PAGES } = require('./paths');

const styles = {
	'test': /\.scss$/,
	'use': [
		MiniCssExtractPlugin.loader,
		'css-loader',
		{
			'loader': 'postcss-loader',
			'options': {
				'config': {
					'path': PATHS.config,
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
						path.join(PATHS.tokens, 'build'),
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
					'quality': 85,
				},
				'optipng': {
					'enabled': false,
				},
				'pngquant': {
					'quality': [0.8, 0.85],
					'speed': 4,
				},
				'webp': {
					'quality': 85,
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
		...PAGES.map(
			(name) => new HtmlWebpackPlugin({
				'filename': `${name}.html`,
				'template': path.join(PATHS.pages, `${name}.pug`),
				'inject': false,
				'templateParameters': (compilation, assets, assetTags, options) => ({
					compilation,
					'webpackConfig': compilation.options,
					'htmlWebpackPlugin': {
						'tags': assetTags,
						'files': assets,
						options,
					},
					'env': process.env.NODE_ENV,
				}),
			}),
		),
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
			// images,
		],
	},
};

module.exports = merge(common, config);
