const path = require('path');
const fs = require('fs');
const { PATHS } = require('./paths');

const isDev = process.env.NODE_ENV !== 'prod';

const saveJSON = (fileName, json) => {
	if (fileName.includes('inline.scss')) {
		return;
	}
	const { name } = path.parse(fileName);
	const jsonFileName = path.resolve(
		PATHS.styles,
		isDev ? `${name}.dev.json` : `${name}.prod.json`,
	);
	fs.writeFileSync(jsonFileName, JSON.stringify(json));
};

module.exports = () => ({
	'plugins': {
		'autoprefixer': {},
		'postcss-normalize': {},
		'postcss-media-minmax': {},
		'postcss-modules': {
			'generateScopedName': isDev ? '[local]' : '[hash:base64:10]',
			'getJSON': saveJSON,
		},
		'postcss-sort-media-queries': {
			'sort': 'mobile-first',
		},
	},
});
