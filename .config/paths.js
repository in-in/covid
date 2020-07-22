const path = require('path');
const fs = require('fs');

const PATHS = {
	'root': process.cwd(),
	'assets': 'assets',
	get 'src'() { return path.resolve(this.root, 'src'); },
	get 'dist'() { return path.resolve(this.root, 'dist'); },
	get 'config'() { return path.resolve(this.root, '.config'); },
	get 'templates'() { return path.join(this.config, 'templates'); },
	get 'components'() { return path.resolve(this.src, 'components'); },
	get 'pages'() { return path.resolve(this.src, 'pages'); },
	get 'styles'() { return path.resolve(this.src, 'styles'); },
	get 'tokens'() { return path.resolve(this.src, 'tokens'); },
	get 'images'() { return path.join(this.assets, 'images'); },
	get 'icons'() { return path.join(this.assets, 'icons'); },
	get 'fonts'() { return path.join(this.assets, 'fonts'); },
};

const PAGES = fs
	.readdirSync(PATHS.pages)
	.filter((i) => i.endsWith('.pug'))
	.map((p) => path.basename(p, '.pug'));

module.exports = { PATHS, PAGES };
