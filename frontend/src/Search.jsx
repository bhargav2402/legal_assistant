import React, { useState } from "react";

function Document({ title, publishDate, headline }) {
	return (
		<div className="border border-gray-300 rounded-md p-4 mb-4">
			<h2 className="text-lg font-semibold mb-2">{title}</h2>
			<p className="text-sm text-gray-600 mb-1">
				<strong>Published Date:</strong> {publishDate}
			</p>
			<p className="text-base">{headline}</p>
		</div>
	);
}

function Search() {
	const [formInput, setFormInput] = useState("");
	const [docs, setDocs] = useState([]);
	const [pageNum, setPageNum] = useState(1); // State for current page number

	const handleInputChange = (event) => {
		setFormInput(event.target.value);
	};

	const handleSearch = async (event) => {
		event.preventDefault();

		try {
			const response = await fetch(
				`http://127.0.0.1:5000/api/search`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ formInput, pageNum }), // Include pageNum in the request
				}
			);

			const data = await response.json();
			setDocs(data.docs);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handlePageChange = async (increment) => {
		const nextPageNum = pageNum + increment;

		try {
			const response = await fetch(
				`http://127.0.0.1:5000/api/search`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ formInput, pageNum: nextPageNum }), // Include nextPageNum in the request
				}
			);

			const data = await response.json();
			setDocs(data.docs);
			setPageNum(nextPageNum); // Update pageNum state
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4">Search Documents</h1>
			<form onSubmit={handleSearch} className="mb-4">
				<input
					type="text"
					value={formInput}
					onChange={handleInputChange}
					placeholder="Enter your search query..."
					className="border border-gray-300 rounded-md px-4 py-2 mr-2"
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded-md"
				>
					Search
				</button>
			</form>
			<div className="flex flex-col items-center">
				{docs.length > 0 ? (
					<>
						{docs.map((doc) => (
							<Document
								key={doc.tid}
								title={doc.title}
								publishDate={doc.publishdate}
								headline={doc.headline}
							/>
						))}
						<div className="flex items-center">
							<button
								onClick={() => handlePageChange(-1)}
								disabled={pageNum === 1}
								className="mr-2"
							>
								Prev
							</button>
							<span>Page {pageNum}</span>
							<button onClick={() => handlePageChange(1)}>
								Next
							</button>
						</div>
					</>
				) : (
					<p>No documents found.</p>
				)}
			</div>
		</div>
	);
}

export default Search;
