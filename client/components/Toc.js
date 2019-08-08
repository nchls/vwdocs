import React, { useState } from 'react';
import { withRouter, Link } from "react-router-dom";


const Toc = ({ location }) => {
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

	const pathName = location.pathname;
	const pageId = pathName.substring(1);

	return (
		<nav className="toc">
			{ toc && (
				<ol>
					<TocItem key={toc.id} currentPageId={pageId} {...toc} />
				</ol>
			) }
		</nav>
	);
};

const TocItem = ({ id, name, children, currentPageId }) => {

	const shouldShowChildren = (children && (id === 'ASGR_ROOT' || currentPageId.startsWith(id)));

	return (
		<li>
			<Link to={`/${id}`}>{name}</Link>
			{ shouldShowChildren && (
				<ol>
					{ children.map((child) => {
						return <TocItem key={child.id} currentPageId={currentPageId} {...child} />;
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

export default withRouter(Toc);
