const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const classnames = require('classnames');
const { PATHS, PAGES } = require('./paths');

const isDev = process.env.NODE_ENV !== 'prod';

global.icons = path.join(PATHS.src, PATHS.icons);
global.cx = classnames;
global.parseFilename = (filename) => path.parse(filename);

const pug = {
	'test': /\.pug$/,
	'use': {
		'loader': 'pug-loader',
		'options': {
			'globals': ['icons', 'cx', 'parseFilename'],
		},
	},
};

const images = {
	'test': /\.(png|jpe?g|webp|svg)$/i,
	'use': [
		{
			'loader': 'file-loader',
			'options': {
				'name': isDev ? '[name].[ext]' : '[contenthash].[ext]',
				'outputPath': PATHS.images,
			},
		},
	],
};

const fonts = {
	'test': /\.(woff2|woff|ttf|otf)$/i,
	'use': {
		'loader': 'file-loader',
		'options': {
			'name': isDev ? '[name].[ext]' : '[contenthash].[ext]',
			'outputPath': PATHS.fonts,
		},
	},
};

const config = {
	'entry': {
		'main': path.join(PATHS.src, 'index.js'),
		'styles': [
			path.resolve(PATHS.styles, 'inline.scss'),
			path.resolve(PATHS.styles, 'styles.scss'),
		],
	},
	'module': {
		'rules': [
			pug,
			images,
			fonts,
		],
	},
	'plugins': [
		...PAGES.map(
			(name) => new HtmlWebpackPlugin({
				'filename': `${name}.html`,
				'template': path.join(PATHS.pages, `${name}.pug`),
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
			'svgoConfig': [
				{
					'removeUnknownsAndDefaults': {
						'unknownAttrs': false,
					},
				},
			],
		}),
		new FaviconsWebpackPlugin({
			'logo': path.join(PATHS.src, 'assets', 'favicon.svg'),
			'outputPath': path.join(PATHS.assets, 'favicon'),
			'prefix': path.join(PATHS.assets, 'favicon'),
			'inject': true,
			'favicons': {
				'appName': 'Covid-19',
				'icons': {
					'appleIcon': [
						'apple-touch-icon-180x180.png',
					],
					'appleStartup': false,
					'coast': false,
					'favicons': [
						'favicon-16x16.png',
						'favicon-32x32.png',
						'favicon.ico',
					],
					'firefox': false,
					'windows': false,
					'yandex': false,
				},
			},
		}),
	],
};

module.exports = config;
