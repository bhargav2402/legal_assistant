import React, { useState, useEffect } from "react";
import axios from "axios";

function DisplayOutput() {
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputText.trim() !== "") {
      fetchData();
    }
  }, [inputText]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/ArtifactAI/led_large_16384_billsum_summarization",
        { inputs: inputText },
        {
          headers: {
            Authorization: "Bearer YOUR_HUGGING_FACE_TOKEN_HERE",
          },
        }
      );
      setOutput(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleClearOutput = () => {
    setOutput(null);
    setInputText("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 flex flex-col items-center justify-center">
      <textarea
        className="bg-gray-800 text-white p-4 rounded-md mb-4 w-full max-w-xl resize-none"
        placeholder="Enter text..."
        rows={6}
        value={inputText}
        onChange={handleInputChange}
      />
      <div className="flex justify-between w-full max-w-xl">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          onClick={fetchData}
          disabled={!inputText.trim()}
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md"
          onClick={handleClearOutput}
        >
          Clear Output
        </button>
      </div>
      <div className="bg-gray-800 text-white p-4 rounded-md mt-4 w-full max-w-xl h-64 overflow-auto">
        <h1 className="text-xl font-semibold mb-2">Output:</h1>
        {loading ? (
          <p>Loading...</p>
        ) : output ? (
          <pre>{JSON.stringify(output, null, 2)}</pre>
        ) : (
          <p>No output available. Enter some text and click Fetch.</p>
        )}
      </div>
    </div>
  );
}

export default DisplayOutput;
