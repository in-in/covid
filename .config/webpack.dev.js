const fs = require('fs');
const path = require('path');
const { merge } = require('webpack-merge');
const StylelintPlugin = require('stylelint-webpack-plugin');
const common = require('./webpack.config');
const { PATHS } = require('./paths');

const SSL_CERT = process.env.CERT_FILE_LOCALHOST;
const SSL_KEY = process.env.KEY_FILE_LOCALHOST;

const style = {
	'test': /\.scss$/,
	'use': [
		'style-loader',
		{
			'loader': 'css-loader',
			'options': {
				'sourceMap': true,
			},
		},
		{
			'loader': 'postcss-loader',
			'options': {
				'config': {
					'path': PATHS.config,
				},
				'sourceMap': true,
			},
		},
		{
			'loader': 'sass-loader',
			'options': {
				'sourceMap': true,
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

const config = {
	'mode': 'development',
	'output': {
		'filename': '[name].js',
		'path': PATHS.dist,
	},
	'devtool': 'eval-cheap-module-source-map',
	'devServer': {
		'clientLogLevel': 'silent',
		'host': '0.0.0.0',
		'https': {
			'cert': fs.readFileSync(SSL_CERT),
			'key': fs.readFileSync(SSL_KEY),
		},
		'overlay': true,
		'port': 7777,
		'stats': 'minimal',
	},
	'module': {
		'rules': [
			style,
		],
	},
	'plugins': [
		new StylelintPlugin({
			'fix': true,
		}),
	],
};

module.exports = merge(common, config);
