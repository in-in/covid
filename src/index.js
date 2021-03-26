import 'alpinejs';

window.covid = () => ({
	smoothScroll(id) {
		document
			.querySelector(id)
			.scrollIntoView({
				'behavior': 'smooth',
			});
	},

	'thresholdBottom': null,
	'thresholdTop': null,

	thresholdObserver(threshold, el) {
		new IntersectionObserver((entries) => {
			this[threshold] = (entries[0].intersectionRatio <= 0);
		}).observe(el);
	},

	backToTop() {
		const header = document.querySelector('#js-header-menu');
		const footer = document.querySelector('#js-footer-menu');

		this.thresholdObserver('thresholdTop', header);
		this.thresholdObserver('thresholdBottom', footer);
	},
});
