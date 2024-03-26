import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ImageToTextConverter = () => {
	const [output, setOutput] = useState("");
	const [translatedText, setTranslatedText] = useState("");
	const [error, setError] = useState("");
	const [supportedLanguages, setSupportedLanguages] = useState([]);
	const [targetLang, setTargetLang] = useState("es");

	const API_KEY = "AIzaSyBeWedYJarTwFhzhLWPHqaRwJQaMC3gU4g";

	useEffect(() => {
		const fetchSupportedLanguages = async () => {
			try {
				const response = await axios.get(
					"https://translation.googleapis.com/language/translate/v2/languages",
					{
						params: {
							key: API_KEY,
						},
					}
				);
				setSupportedLanguages(response.data.data.languages);
			} catch (error) {
				console.error(
					"Error fetching supported languages:",
					error.response?.data || error.message
				);
				setError("Failed to fetch supported languages.");
			}
		};

		fetchSupportedLanguages();
	}, [API_KEY]);

	async function analyzeImage(event) {
		const file = event.target.files[0];
		if (!file) {
			alert("Please select an image file.");
			return;
		}

		try {
			const base64Image = await convertImageToBase64(file);
			const text = await performOCR(base64Image);
			setOutput(`\`\`\`markdown\n${text}\n\`\`\``);
		} catch (error) {
			console.error("Error:", error.response?.data || error.message);
			setError("Error processing image. Please try again.");
		}
	}

	async function convertImageToBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result.split(",")[1]);
			reader.onerror = (error) => reject(error);
			reader.readAsDataURL(file);
		});
	}

	async function performOCR(base64Image) {
		try {
			const response = await axios.post(
				"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-vision-latest:generateContent",
				{
					contents: [
						{
							parts: [
								{
									inlineData: {
										mimeType: "image/jpeg",
										data: base64Image,
									},
								},
							],
						},
					],
					generationConfig: {
						temperature: 0.9,
						topK: 40,
						topP: 0.95,
						maxOutputTokens: 1024,
						stopSequences: [],
					},
					safetySettings: [
						{
							category: "HARM_CATEGORY_HARASSMENT",
							threshold: "BLOCK_MEDIUM_AND_ABOVE",
						},
						{
							category: "HARM_CATEGORY_HATE_SPEECH",
							threshold: "BLOCK_MEDIUM_AND_ABOVE",
						},
						{
							category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
							threshold: "BLOCK_MEDIUM_AND_ABOVE",
						},
						{
							category: "HARM_CATEGORY_DANGEROUS_CONTENT",
							threshold: "BLOCK_MEDIUM_AND_ABOVE",
						},
					],
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${API_KEY}`,
					},
				}
			);
			return response.data.candidates[0].content.parts[0].text;
		} catch (error) {
			console.error(
				"OCR Error:",
				error.response?.data || error.message
			);
			throw new Error("OCR failed. Please try again.");
		}
	}

	async function translateText(text, sourceLang, targetLang) {
		try {
			const response = await axios.post(
				"https://translation.googleapis.com/language/translate/v2",
				{
					q: text,
					source: sourceLang,
					target: targetLang,
					key: API_KEY,
				}
			);
			setTranslatedText(
				response.data.data.translations[0].translatedText
			);
		} catch (error) {
			console.error(
				"Translation Error:",
				error.response?.data || error.message
			);
			setError("Translation failed. Please try again.");
		}
	}

	const handleLanguageChange = (event) => {
		setTargetLang(event.target.value);
	};

	return (
		<div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-8">
		<h1 className="text-4xl font-bold mb-4">Document Translation</h1>
		<div className="bg-white rounded-lg shadow-md p-6 mb-8">
		  <h2 className="text-2xl font-semibold mb-4">How to Use:</h2>
		  <ol className="list-decimal list-inside">
			<li>Upload an image containing text (e.g., a document, contract, or agreement).</li>
			<li>Our AI will extract the text from the image using Optical Character Recognition (OCR).</li>
			<li>The extracted text will be displayed in the output section.</li>
			<li>Select the target language from the dropdown menu.</li>
			<li>Click the "Translate" button to translate the extracted text to the selected language.</li>
			<li>The translated text will be displayed in the "Translated Text" section.</li>
		  </ol>
		  <h2 className="text-2xl font-semibold mt-6 mb-4">Expected Output:</h2>
		  <p>
			Accurate translation of the extracted text from the uploaded image, including:
		  </p>
		  <ul className="list-disc list-inside">
			<li>Preservation of formatting and layout</li>
			<li>Correct translation of technical terms and legal jargon</li>
			<li>Contextual understanding of the document's content</li>
			<li>Availability in multiple languages</li>
		  </ul>
		</div>
		<input
		  type="file"
		  onChange={analyzeImage}
		  accept=".jpg, .jpeg, .png"
		  className="mb-4 px-4 py-2 border border-gray-400 rounded-md"
		/>
		{output && (
		  <div className="mt-8 p-6 bg-gray-300 rounded-md">
			<h2 className="text-xl font-semibold mb-2">Extracted Text:</h2>
			<ReactMarkdown>{output}</ReactMarkdown>
			<div className="mt-4 flex items-center">
			  <label htmlFor="targetLang" className="font-semibold mr-2">
				Translate to:
			  </label>
			  <select
				id="targetLang"
				value={targetLang}
				onChange={handleLanguageChange}
				className="border border-gray-400 rounded p-1"
			  >
				{supportedLanguages.map((lang) => (
				  <option key={lang.language} value={lang.language}>
					{lang.name}
				  </option>
				))}
			  </select>
			  <button
				onClick={() => translateText(output.replace(/`/g, ""), "en", targetLang)}
				className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded ml-2 transition-colors duration-300"
			  >
				Translate
			  </button>
			</div>
		  </div>
		)}
		{translatedText && (
		  <div className="mt-8 p-6 bg-gray-300 rounded-md">
			<h2 className="text-xl font-semibold mb-2">Translated Text:</h2>
			<ReactMarkdown>{`\`\`\`markdown\n${translatedText}\n\`\`\``}</ReactMarkdown>
		  </div>
		)}
		{error && <p className="text-red-500 mt-4">{error}</p>}
	  </div>
	);
  };

export default ImageToTextConverter;
