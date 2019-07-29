let toc;

const elements = {
	'toc': document.getElementsByClassName('toc')[0],
	'content': document.getElementsByClassName('main')[0]
};

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

const renderToc = () => {

};

init();

