import React, { useState, useEffect } from "react";

function Document({ title, publishDate, headline }) {
  const encodedTitle = encodeURIComponent(title);
  const googleSearchLink = `https://www.google.com/search?q=${encodedTitle}`;
  return (
    <div className="border border-gray-600 rounded-md p-4 mb-4 shadow-gray-900 shadow-lg bg-gray-700 hover:shadow-md transition-shadow">
      <h2 className="text-lg text-blue-400 font-medium mb-2">
        <a
          href={googleSearchLink}
          target="_blank"
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </h2>
      <p className="text-sm text-gray-400 mb-1">
        <strong>Published Date:</strong> {publishDate}
      </p>
      <p className="text-base text-gray-300" dangerouslySetInnerHTML={{ __html: headline }} />
    </div>
  );
}

function Document2({ title, description, author, publishedDate, url, imageUrl }) {
  const encodedTitle = encodeURIComponent(title);
  const googleSearchLink = `https://www.google.com/search?q=${encodedTitle}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex h-72 shadow-black shadow-lg bg-gray-700  items-stretch mb-6 rounded-md overflow-hidden">
      <div className="border border-gray-600  w-40 h-40 flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>
      <div className="flex-1 ml-4 p-4">
        <h2 className="text-lg text-blue-400 font-medium mb-2">{title}</h2>
        {author && <p className="text-sm text-gray-400 mb-1">Author: {author}</p>}
        <p className="text-sm text-gray-400 mb-1">Published Date: {publishedDate}</p>
        <p className="text-base text-gray-300 mb-2">{description}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          Read More
        </a>
      </div>
    </a>
  );
}

function Search() {
  const [formInput, setFormInput] = useState("");
  const [docs, setDocs] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [showManual, setShowManual] = useState(true);
  const [docs2, setDocs2] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (event) => {
    setFormInput(event.target.value);
  };

  const fetchLegalNews = async () => {
    try {
      const response = await fetch(
        "https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=5a78b5a141034664a83e7823f42aa6bb"
      );
      const data = await response.json();
      const filteredArticles = data.articles
        .slice(0, 4)
        .filter((article) => article.urlToImage);
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

  useEffect(() => {
    const fetchLegalNews = async () => {
      try {
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=5a78b5a141034664a83e7823f42aa6bb"
        );
        const data = await response.json();
        const filteredArticles = data.articles
          .slice(0, 5)
          .filter((article) => article.urlToImage && article.title && article.description);
        setDocs2(filteredArticles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching legal news:", error);
        setLoading(false);
      }
    };

    fetchLegalNews();
  }, []);

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
    <div className="flex flex-col min-h-screen bg-gray-800">
      <header className="bg-gray-700 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-300">Codecatalysts</h1>
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={formInput}
              onChange={handleInputChange}
              placeholder="Search news articles..."
              className="border border-gray-600 rounded-l-md px-4 py-2 w-80 bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="bg-gray-700 rounded-md shadow-black shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">
              How to Use the Codecatalysts Search Engine
            </h2>
            <p className="text-gray-400 mb-2">1. Enter your search query in the input field.</p>
            <p className="text-gray-400 mb-2">
              2. Click the "Search" button or press Enter to start the search.
            </p>
            <p className="text-gray-400 mb-2">
              3. The search results will be displayed below, with each result showing the title,
              publish date, and headline.
            </p>
            <p className="text-gray-400 mb-2">4. Click on the title of a result to open a Google search for that article.</p>
            <p className="text-gray-400">5. Use the "Prev" and "Next" buttons to navigate through the pages of search results.</p>
          </div>
        )}

        <div className="w-full">
          {docs.length > 0 ? (
            <>
              {docs.map((doc) => (
                <Document
                  key={doc.title}
                  title={doc.title}
                  publishDate={doc.publishdate}
                  headline={doc.headline}
                />
              ))}
              <div className="flex items-center justify-center mt-4">
                <button
                  onClick={() => handlePageChange(-1)}
                  disabled={pageNum === 1}
                  className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <span className="mx-2 text-gray-400">Page {pageNum}</span>
                <button
                  onClick={() => handlePageChange(1)}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 grid-rows-2 gap-6">
              {docs2.length > 0 ? (
                <>
                  <div className="col-span-2 md:col-span-1">
                    <Document2
                      key={docs2[0].title}
                      title={docs2[0].title}
                      author={docs2[0].author}
                      publishDate={docs2[0].publishedAt}
                      description={docs2[0].description}
                      imageUrl={docs2[0].urlToImage}
                      url={docs2[0].url}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Document2
                      key={docs2[1].title}
                      title={docs2[1].title}
                      author={docs2[1].author}
                      publishDate={docs2[1].publishedAt}
                      description={docs2[1].description}
                      imageUrl={docs2[1].urlToImage}
                      url={docs2[1].url}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Document2
                      key={docs2[2].title}
                      title={docs2[2].title}
                      author={docs2[2].author}
                      publishDate={docs2[2].publishedAt}
                      description={docs2[2].description}
                      imageUrl={docs2[2].urlToImage}
                      url={docs2[2].url}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Document2
                      key={docs2[3].title}
                      title={docs2[3].title}
                      author={docs2[3].author}
                      publishDate={docs2[3].publishedAt}
                      description={docs2[3].description}
                      imageUrl={docs2[3].urlToImage}
                      url={docs2[3].url}
                    />
                  </div>
                </>
              ) : (
                <p className="text-gray-400">No documents found.</p>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400">&copy; 2023 Codecatalysts</div>
      </footer>
    </div>
  );
}

export default Search;