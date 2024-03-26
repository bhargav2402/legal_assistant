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
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Agreement Summary</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">How to Use:</h2>
        <ol className="list-decimal list-inside">
          <li>Enter the text of a legal agreement in the textarea.</li>
          <li>Click the "Fetch" button.</li>
          <li>
            Our AI will analyze the agreement and generate a comprehensive
            summary, highlighting key terms, clauses, and provisions.
          </li>
          <li>
            The summary will be displayed in the output section below, helping
            you quickly understand the essence of the agreement.
          </li>
        </ol>
        <h2 className="text-2xl font-semibold mt-6 mb-4">Expected Output:</h2>
        <p>
          A concise yet informative summary of the legal agreement, including:
        </p>
        <ul className="list-disc list-inside">
          <li>Key terms and definitions</li>
          <li>Major clauses and provisions</li>
          <li>Obligations and responsibilities of each party</li>
          <li>Termination conditions and dispute resolution mechanisms</li>
          <li>
            Any other critical information to understand the agreement's scope
            and implications.
          </li>
        </ul>
      </div>
      <textarea
        className="bg-gray-300 text-gray-900 py-6 px-2 rounded-md mb-4 w-full max-w-6xl resize-none"
        placeholder="Enter text..."
        rows={8}
        value={inputText}
        onChange={handleInputChange}
      />
      <div className="flex justify-between w-full max-w-6xl">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
          onClick={fetchData}
          disabled={!inputText.trim()}
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-md transition-colors duration-300"
          onClick={handleClearOutput}
        >
          Clear Output
        </button>
      </div>
      <div className="bg-gray-300 text-gray-800 p-6 rounded-md mt-4 w-full max-w-6xl min-h-72 overflow-auto">
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