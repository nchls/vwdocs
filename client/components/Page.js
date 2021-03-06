import React, { useState } from 'react';


const Page = ({ match }) => {
	const pageId = match.params.pageId;

	const [pageFetchState, setPageFetchState] = useState('NOT_FETCHED');
	const [page, setPage] = useState(null);
	const [fetchedPageId, setFetchedPageId] = useState(null);

	if (pageFetchState === 'NOT_FETCHED' || pageId !== fetchedPageId) {
		setPageFetchState('FETCHING');
		setFetchedPageId(pageId);
		getPage(pageId).then((pageResponse) => {
			setPage(pageResponse);
			setPageFetchState('FETCHED');
		}).catch(() => {
			setPageFetchState('FAILED');
		});
	}

	if (page === null) {
		return null;
	}

	return (
		<div className="page" dangerouslySetInnerHTML={{
			__html: page.content
		}}></div>
	);
};

const getPage = (pageId) => {
	return new Promise((resolve, reject) => {
		fetch(`/api/page/${pageId}`)
			.then((response) => {
				if (response.ok) {
					resolve(response.json());
				} else {
					reject(response);
				}
			});
	});
};

export default Page;
