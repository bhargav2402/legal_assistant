import React, { useState } from "react";

function Document({ title, publishDate, headline }) {
	return (
		<div className="border border-gray-500 rounded-md p-4 mb-4">
			<h2 className="text-lg font-semibold mb-2" dangerouslySetInnerHTML={{ __html: title }}></h2>
			<p className="text-sm text-gray-600 mb-1">
				<strong>Published Date:</strong> {publishDate}
			</p>
			<p className="text-base" dangerouslySetInnerHTML={{ __html: headline }}></p>
		</div>
	);
}

function Search() {
	const [formInput, setFormInput] = useState("");
	const [docs, setDocs] = useState([]);
	const [pageNum, setPageNum] = useState(1); 

	const handleInputChange = (event) => {
		setFormInput(event.target.value);
	};

	const handleSearch = async (event) => {
		event.preventDefault();

		try {
			const response = await fetch(
				"http://localhost:5000/api/search",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ formInput, pageNum }), 
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
				"http://localhost:5000/api/search",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ formInput, pageNum: nextPageNum }), 
				}
			);

			const data = await response.json();
			setDocs(data.docs);
			setPageNum(nextPageNum); 
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-[100vh] overflow-auto bg-gray-100">
			<h1 className="text-2xl font-bold mb-4">Search Documents</h1>
			<form onSubmit={handleSearch} className="mb-4 w-full max-w-lg">
				<input
					type="text"
					value={formInput}
					onChange={handleInputChange}
					placeholder="Enter your search query..."
					className="border border-gray-500 rotext-2xl font-bold mb-4unded-md px-4 py-2 w-full"
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 w-full"
				>
					Search
				</button>
			</form>
			<div className="w-full max-w-7xl">
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
						<div className="flex items-center justify-center mt-4">
							<button
								onClick={() => handlePageChange(-1)}
								disabled={pageNum === 1}
								className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md"
							>
								Prev
							</button>
							<span className="mx-2">Page {pageNum}</span>
							<button onClick={() => handlePageChange(1)} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md">
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
