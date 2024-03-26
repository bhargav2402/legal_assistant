import React, { useState } from "react";

function Document({ title, publishDate, headline }) {
  const encodedTitle = encodeURIComponent(title);
  const googleSearchLink = `https://www.google.com/search?q=${encodedTitle}`;
  return (
    <div className="border border-gray-200 rounded-md p-4 mb-4 bg-white hover:shadow-md transition-shadow">
      <h2 className="text-lg text-blue-600 font-medium mb-2">
        <a
          href={googleSearchLink}
          target="_blank"
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{ __html: title }}
        ></a>
      </h2>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Published Date:</strong> {publishDate}
      </p>
      <p className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: headline }}></p>
    </div>
  );
}

function Search() {
  const [formInput, setFormInput] = useState("");
  const [docs, setDocs] = useState([]);
  const [newsdocs , setNewsDocs] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [showManual, setShowManual] = useState(true);

  const handleInputChange = (event) => {
    setFormInput(event.target.value);
  };

  const fetchLegalNews = async () => {
	try {
	  const response = await fetch(
		"https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=5a78b5a141034664a83e7823f42aa6bb"
	  );
	  const data = await response.json();
	  const filteredArticles = data.articles.slice(0, 4).filter(article => article.urlToImage);
	  setDocs(
		filteredArticles.map((article) => ({
		  title: article.title,
		  publishdate: article.publishedAt,
		  headline: article.description,
		  imageUrl: article.urlToImage,
		}))
	  );
	} catch (error) {
	  console.error("Error fetching legal news:", error);
	}
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setShowManual(false);
    try {
      const response = await fetch("http://localhost:5003/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formInput, pageNum }),
      });
      const data = await response.json();
      setDocs(data.docs);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChange = async (increment) => {
    const nextPageNum = pageNum + increment;
    try {
      const response = await fetch("http://localhost:5003/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formInput, pageNum: nextPageNum }),
      });
      const data = await response.json();
      setDocs(data.docs);
      setPageNum(nextPageNum);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Codecatalysts</h1>
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={formInput}
              onChange={handleInputChange}
              placeholder="Search news articles..."
              className="border border-gray-300 rounded-l-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        {showManual && (
          <div className="bg-white rounded-md shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How to Use the Codecatalysts Seach Engine 
            </h2>
            <p className="text-gray-600 mb-2">
              1. Enter your search query in the input field.
            </p>
            <p className="text-gray-600 mb-2">
              2. Click the "Search" button or press Enter to start the search.
            </p>
            <p className="text-gray-600 mb-2">
              3. The search results will be displayed below, with each result showing the title, publish date, and headline.
            </p>
            <p className="text-gray-600 mb-2">
              4. Click on the title of a result to open a Google search for that article.
            </p>
            <p className="text-gray-600">
              5. Use the "Prev" and "Next" buttons to navigate through the pages of search results.
            </p>
          </div>
        )}

        <div className="w-full">
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
                  className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <span className="mx-2 text-gray-600">Page {pageNum}</span>
                <button
                  onClick={() => handlePageChange(1)}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-600">No documents found.</p>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 py-4">
        <div className="container mx-auto px-4 text-center text-gray-300">
          &copy; 2023 Codecatalysts
        </div>
      </footer>
    </div>
  );
}

export default Search;