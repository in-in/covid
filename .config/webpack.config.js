const { join, parse } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const classnames = require('classnames');
const { PATHS, PAGES } = require('./paths');

const isDev = process.env.NODE_ENV !== 'prod';

global.icons = join(PATHS.src, PATHS.icons);
global.cx = classnames;
global.parseFilename = (filename) => parse(filename);

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
	'type': 'asset/resource',
	'generator': {
		'filename': join(PATHS.images, isDev ? '[name][ext]' : '[contenthash][ext]'),
	},
};

const fonts = {
	'test': /\.(woff2|woff|ttf|otf)$/i,
	'type': 'asset/resource',
	'generator': {
		'filename': join(PATHS.fonts, isDev ? '[name][ext]' : '[contenthash][ext]'),
	},
};

const config = {
	'entry': {
		'main': join(PATHS.src, 'index.js'),
		'styles': [
			join(PATHS.styles, 'inline.scss'),
			join(PATHS.styles, 'styles.scss'),
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
				'template': join(PATHS.pages, `${name}.pug`),
				'inject': false,
				'scriptLoading': isDev ? 'defer' : 'blocking',
				'templateParameters': {
					'isDev': isDev,
				},
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
		new FaviconsWebpackPlugin(
			{
				'logo': join(PATHS.src, 'assets', 'favicon.svg'),
				'outputPath': join(PATHS.assets, 'favicon'),
				'prefix': join(PATHS.assets, 'favicon/'),
				'inject': true,
				'favicons': {
					'appName': 'Covid-19',
					'appShortName': null,
					'appDescription': null,
					'developerName': null,
					'developerURL': null,
					'icons': {
						'android': false,
						'appleIcon': [
							'apple-touch-icon-180x180.png',
						],
						'appleStartup': false,
						'coast': false,
						'favicons': [
							'favicon-32x32.png',
						],
						'firefox': false,
						'windows': false,
						'yandex': false,
					},
				},
			},
		),
	],
};

module.exports = config;
