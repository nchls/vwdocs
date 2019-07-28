(function() {
	let toc;

	const init = () => {
		getToc()
			.then((gotToc) => {
				toc = gotToc;
				console.log(toc);
			});
	};

	const getToc = () => {
		return new Promise((resolve, reject) => {
			fetch('/api/toc')
				.then((response) => {
					if (response.ok) {
						resolve(response.json());
					} else {
						reject(response);
					}
				});
		});
	};

	init();
}());
