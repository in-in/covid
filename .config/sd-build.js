/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const { join } = require('path');
const Handlebars = require('handlebars');
const sd = require('style-dictionary');
const { 'PATHS': { templates, tokens } } = require('./paths');

const buildPath = join(tokens, 'build', '/');

const sdConfig = {
	'source': [
		`${tokens}/properties/**/*.{js,json}`,
	],
	'platforms': {
		'scss': {
			'transforms': [
				'attribute/cti',
				'color/css',
				'name/cti/snake',
			],
			'buildPath': buildPath,
			'files': [{
				'destination': 'color.scss',
				'format': 'scss/variables',
				'options': { 'showFileHeader': false },
				'filter': {
					'attributes': {
						'category': 'color',
					},
				},
			}, {
				'destination': 'easing.scss',
				'format': 'scss/variables',
				'options': { 'showFileHeader': false },
				'filter': {
					'attributes': {
						'category': 'easing',
					},
				},
			}, {
				'destination': 'grid.scss',
				'format': 'scss/variables',
				'options': { 'showFileHeader': false },
				'filter': {
					'attributes': {
						'category': 'grid',
					},
				},
			}, {
				'destination': 'shadow.scss',
				'format': 'scss/variables',
				'options': { 'showFileHeader': false },
				'filter': {
					'attributes': {
						'category': 'shadow',
					},
				},
			}, {
				'destination': 'size.scss',
				'format': 'scss/variables',
				'options': { 'showFileHeader': false },
				'filter': {
					'attributes': {
						'category': 'size',
					},
				},
			}, {
				'destination': 'spacing.scss',
				'format': 'scss/variables',
				'options': { 'showFileHeader': false },
				'filter': {
					'attributes': {
						'category': 'spacing',
					},
				},
			}, {
				'destination': 'time.scss',
				'format': 'scss/variables',
				'options': { 'showFileHeader': false },
				'filter': {
					'attributes': {
						'category': 'time',
					},
				},
			}, {
				'destination': 'typography.scss',
				'format': 'scss/variables',
				'options': { 'showFileHeader': false },
				'filter': {
					'attributes': {
						'category': 'typography',
					},
				},
			}],
		},
		'scss-map': {
			'transforms': [
				'attribute/cti',
				'name/cti/snake',
			],
			'buildPath': buildPath,
			'files': [{
				'destination': 'breakpoint.scss',
				'format': 'map-nested',
				'filter': {
					'attributes': {
						'category': 'breakpoint',
					},
				},
			}, {
				'destination': 'asset.scss',
				'format': 'map-nested',
				'filter': {
					'attributes': {
						'category': 'asset',
					},
				},
			}],
		},
		'js': {
			'transformGroup': 'web',
			'transforms': [
				'name/cti/camel',
			],
			'buildPath': buildPath,
			'files': [{
				'destination': 'tokens.js',
				'format': 'javascript/es6',
				'options': { 'showFileHeader': false },
			}],
		},
		'json': {
			'transforms': [
				'name/cti/camel',
			],
			'buildPath': buildPath,
			'files': [{
				'destination': 'tokens.json',
				'format': 'json/flat',
				'options': { 'showFileHeader': false },
			}],
		},
	},
};

const sdExtended = sd.extend(sdConfig);

const template = Handlebars.compile(fs
	.readFileSync(`${templates}/map-nested.hbs`)
	.toString());

sdExtended.registerFormat({
	'name': 'map-nested',
	formatter(dictionary) {
		return template({
			'properties': dictionary.properties,
		});
	},
});

sdExtended.buildAllPlatforms();
