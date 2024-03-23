import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function ImageAnalysis() {
	const [output, setOutput] = useState("");

	const API_KEY = "YOUR_GOOGLE_API_KEY_HERE";

	async function analyzeImage(event) {
		const file = event.target.files[0];
		if (!file) {
			alert("Please select an image file.");
			return;
		}

		try {
			const base64Image = await convertImageToBase64(file);
			const response = await axios.post(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-vision-latest:generateContent?key=YOUR_GOOGLE_API_KEY_HERE`,
				{
					contents: [
						{
							parts: [
								{
									text: "Imagine you have an image containing text, whether it's handwritten or printed. Your task is to accurately transcribe the text from the image into plain text format. As you describe the content, pay attention to details such as handwriting style, font (if printed), layout, and any other unique features that may impact readability. Your goal is to provide a clear and precise transcription of the text, ensuring that the converted text reflects the original content as faithfully as possible.",
								},
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
				}
			);
			setOutput(
				JSON.stringify(
					response.data.candidates[0].content.parts[0].text,

					null,
					2
				)
			);
		} catch (error) {
			console.error("Error:", error.response.data);
		}
	}

	function convertImageToBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result.split(",")[1]);
			reader.onerror = (error) => reject(error);
			reader.readAsDataURL(file);
		});
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-gray-900">
			<h1 className="mb-8 text-3xl font-bold">Upload an image</h1>
			<input
				type="file"
				onChange={analyzeImage}
				accept="image/jpeg, image/png"
				className="mb-8 p-2 border border-gray-500 rounded-md"
			/>
			<div className="w-3/4 p-4 border h-96 text-gray-900 border-gray-500 rounded-md bg-gray-300 shadow-lg overflow-auto whitespace-pre-wrap">
				<div className="markdown-container">
					<ReactMarkdown>{output}</ReactMarkdown>
				</div>
			</div>
		</div>
	);
}

export default ImageAnalysis;
