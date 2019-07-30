import React, { useState } from 'react';
import { Link } from "react-router-dom";


const Toc = () => {
	const [tocFetchState, setTocFetchState] = useState('NOT_FETCHED');
	const [toc, setToc] = useState(null);

	if (tocFetchState === 'NOT_FETCHED') {
		setTocFetchState('FETCHING');
		getToc().then((tocResponse) => {
			setToc(tocResponse);
		}).catch(() => {
			setTocFetchState('FAILED');
		});
	}

	return (
		<nav className="toc">
			{ toc && (
				<ol>
					<TocItem key={toc.id} {...toc} />
				</ol>
			) }
		</nav>
	);
};

const TocItem = (item) => {
	return (
		<li>
			<Link to={`/${item.id}`}>{item.name}</Link>
			{ item.children && (
				<ol>
					{ item.children.map((child) => {
						return <TocItem key={child.id} {...child} />;
					} ) }
				</ol>
			) }
		</li>
	);
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

export default Toc;
