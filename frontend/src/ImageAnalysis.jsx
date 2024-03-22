import React, { useState } from "react";
import axios from "axios";

function ImageAnalysis() {
	const [output, setOutput] = useState("");

	const API_KEY = "AIzaSyAk1QWMnpwBQ-TljMMXaR6oKLpzak67hKQ"; // Replace with your actual API key

	async function analyzeImage(event) {
		const file = event.target.files[0];
		if (!file) {
			alert("Please select an image file.");
			return;
		}

		try {
			const base64Image = await convertImageToBase64(file);
			const response = await axios.post(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-vision-latest:generateContent?key=AIzaSyAk1QWMnpwBQ-TljMMXaR6oKLpzak67hKQ`,
				{
					contents: [
						{
							parts: [
								{
									text: "You are an AI legal advisor tasked with summarizing the contents of a legal agreement provided in the form of an image or PDF document. Your task is to analyze the document and generate a concise summary highlighting the key provisions, clauses, and any important terms or conditions.Please begin by identifying the type of agreement (e.g., contract, lease, NDA) and provide a brief overview of its purpose. Then, systematically go through the document, extracting and summarizing each major section or clause. Focus on essential information such as obligations of the parties involved, payment terms, termination conditions, dispute resolution mechanisms, and any other significant provisions.Your summary should be clear, accurate, and comprehensive, providing the reader with a thorough understanding of the agreement's terms without unnecessary technical jargon. Additionally, if there are any ambiguous or complex language constructs within the document, please clarify them as needed.Keep in mind that the goal is to provide a succinct yet informative summary that allows the reader to grasp the essence of the agreement quickly and efficiently. Ensure that the summary captures the essence of the document while condensing its contents into a digestible format",
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
		<div>
			<h1>Upload an image</h1>
			<input
				type="file"
				onChange={analyzeImage}
				accept="image/jpeg, image/png"
			/>
			<div>{output && <pre>{output}</pre>}</div>
		</div>
	);
}

export default ImageAnalysis;
