import { useState, useCallback, useRef } from 'react';
import './App.css';
import InfiniteScroll from './InfiniteScroll';

function App() {
	const [query, setQuery] = useState('');
	const [data, setData] = useState([]);

	const controllerRef = useRef(null);
	const handleInput = useCallback((e) => {
		setQuery(e.target.value);
	}, []);

	const renderItem = useCallback(({ title }, key, ref) => (
		<div ref={ref} key={key}>
			{title}
		</div>
	));
	const getData = useCallback((query, pageNumber) => {
		//it's a promise
		return new Promise(async (resolve, reject) => {
			try {
				//we checked that if there is an existing reference to controller
				// then immediately abort it else create a new abort controller and pass the controller
				// as signal to the request
				//simple language me -->agr hum getdata function ko again n again call rahe hai
				// and u r making a network call
				//  vo cancel karega previous network call ko and create new fresh network call
				if (controllerRef.current) controllerRef.current.abort();
				controllerRef.current = new AbortController();

				const promise = await fetch(
					'https://openlibrary.org/search.json?' +
						new URLSearchParams({
							q: query,
							page: pageNumber,
						}),
					{ signal: controllerRef.current.signal }
				);
				const data = await promise.json(); // fetch return the promise and you need to call the data .json actually return against the promise
				console.log(data);
				resolve();
				setData((prevData) => [...prevData, ...data.docs]);
			} catch (e) {
				// reject();
			}
		});
	}, []);
	return (
		<div className='App'>
			<input type='text' value={query} onChange={handleInput}></input>

			<InfiniteScroll
				renderListItem={renderItem}
				getData={getData}
				listData={data}
				query={query}
			/>
		</div>
	);
}

export default App;
