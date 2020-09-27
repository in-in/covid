import 'alpinejs';

window.covid = () => ({
	smoothScroll(id, duration = 1000) {
		const
			element = document.scrollingElement || document.documentElement;
		const to = document
			.querySelector(id)
			.getBoundingClientRect().top + -45;
		const start = element.scrollTop;
		const change = to - start;
		const startDate = +new Date();

		const easeInOutQuad = (currentTime, b, c, d) => {
			let t = currentTime;
			t /= d / 2;
			if (t < 1) return (c / 2) * t * t + b;
			t -= 1;
			return -(c / 2) * (t * (t - 2) - 1) + b;
		};
		const animateScroll = () => {
			const currentDate = +new Date();
			const currentTime = currentDate - startDate;
			element.scrollTop = parseInt(
				easeInOutQuad(currentTime, start, change, duration), 10,
			);
			if (currentTime < duration) {
				requestAnimationFrame(animateScroll);
			} else {
				element.scrollTop = to;
			}
		};
		animateScroll();
	},
	'thresholdBottom': null,
	'thresholdTop': null,
	thresholdObserver(threshold, el) {
		new IntersectionObserver((entries) => {
			this[threshold] = (entries[0].intersectionRatio <= 0);
		}).observe(el);
	},
	backToTop() {
		const header = document.querySelector('.header_menu');
		const footer = document.querySelector('.footer_menu');

		this.thresholdObserver('thresholdTop', header);
		this.thresholdObserver('thresholdBottom', footer);
	},
});
