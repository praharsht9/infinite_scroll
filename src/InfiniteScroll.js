import React, { useCallback, useEffect, useRef, useState } from 'react';

const InfiniteScroll = (props) => {
	const { renderListItem, getData, listData, query } = props;
	const pageNumber = useRef(1); // current page no is 1
	const [loading, setLoading] = useState(false);

	//intersection observer
	const observer = useRef(null);
	const lastElementObserver = useCallback((node) => {
		if (loading) return; // do nothing
		if (observer.current) observer.current.disconnect();

		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				pageNumber.current += 1;
				fetchData();
			}
		});
		if (node) observer.current.observe(node);
	});

	const renderList = useCallback(() => {
		return listData.map((item, index) => {
			//checking if the last item that we are rendering is the last item or not
			if (index === listData.length - 1)
				return renderListItem(item, index, lastElementObserver);
			return renderListItem(item, index, null); //if the item is not the last index then the ref is null
		});
	});

	const fetchData = useCallback(() => {
		setLoading(true);
		getData(query, pageNumber.current).finally(() => {
			setLoading(false);
		});
	}, [query]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div>
			{renderList()}

			{loading && 'LOADING'}
		</div>
	);
};

export default InfiniteScroll;
