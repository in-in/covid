const { 'PATHS': { components, styles, templates } } = require('./paths');

const toSnakeCase = (str) => (
	str.includes('-')
		? str.replace('-', '_')
		: str);

const config = (plop) => {
	plop.setGenerator('component', {
		'description': 'Create a component',
		'prompts': [
			{
				'type': 'input',
				'name': 'name',
				'message': 'What is your component name?',
				'filter': (input) => toSnakeCase(input),
			},
		],
		'actions': [
			{
				'type': 'add',
				'path': `${components}/{{ name }}/index.pug`,
				'templateFile': `${templates}/component.pug.hbs`,
			},
			{
				'type': 'add',
				'path': `${components}/{{ name }}/style.scss`,
				'templateFile': `${templates}/component.scss.hbs`,
			},
			{
				'type': 'append',
				'path': `${styles}/styles.scss`,
				'separator': '',
				'template': "@forward '{{ name }}/style';\n",
			},
		],
	});
};

module.exports = config;
