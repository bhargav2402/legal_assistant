import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function CompareAgg() {
	const [output, setOutput] = useState("");
	const [image1, setImage1] = useState(null);
	const [image2, setImage2] = useState(null);

	const API_KEY = "YOUR_GOOGLE_API_KEY_HERE";

	async function analyzeImages() {
		if (!image1 || !image2) {
			alert("Please select two image files.");
			return;
		}

		try {
			const base64Image1 = await convertImageToBase64(image1);
			const base64Image2 = await convertImageToBase64(image2);
			const response = await axios.post(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-vision-latest:generateContent?key=${API_KEY}`,
				{
					contents: [
						{
							parts: [
								{
									text: "As an AI model designed to assist legal professionals, your task is to compare two similar legal documents drafted by different lawyers. Your objective is to analyze the language, structure, and content of each document, with a focus on identifying any discrepancies or inconsistencies. Your analysis should include specific examples and recommendations for potential revisions or improvements to ensure clarity, coherence, and compliance with relevant laws and regulations. Remember to maintain professionalism and objectivity throughout the comparison process. Instructions: 1. Review Process: - Carefully examine both legal documents provided. - Analyze the language, structure, and content of each document. 2. Comparison Criteria: - Evaluate the clarity and precision of legal terminology used in each document. - Assess the completeness and coherence of the legal arguments presented. - Compare the consistency of formatting, numbering, and referencing within each document. - Analyze the adherence to relevant legal statutes, precedents, and regulations. - Consider the overall effectiveness and persuasiveness of the legal arguments presented. 3. Documentation: - Document any differences, discrepancies, or inconsistencies found between the two documents. - Provide specific examples and references to support your analysis. - Highlight any areas where one document may excel over the other in terms of clarity, thoroughness, or compliance. 4. Recommendations: - Based on your analysis, propose potential revisions or improvements to address identified issues. - Suggest strategies for enhancing clarity, coherence, and compliance within the legal documents. - Offer insights into best practices for drafting and reviewing legal documents to ensure quality and effectiveness. 5. Final Evaluation: - Conclude your comparison with a summary of key findings and recommendations. - Provide an overall assessment of the strengths and weaknesses of each document. - Offer guidance on how to proceed with integrating suggested revisions or improvements. 6. Confidentiality and Professionalism: - Maintain strict confidentiality throughout the comparison process. - Exercise professionalism and objectivity in your evaluation and recommendations. - Ensure that all communication regarding the comparison remains within the bounds of legal ethics and professional standards. Conclusion: Your role as an AI model is crucial in conducting a thorough and insightful comparison of the two legal documents. By carefully evaluating the language, content, and compliance of each document, you will contribute to enhancing their quality and effectiveness in addressing legal matters. Your detailed analysis and recommendations will serve as a valuable resource for optimizing the clarity, coherence, and compliance of legal documents in the future. Focus very highly on the Legal Side of the documents.",
								},
								{
									inlineData: {
										mimeType: "image/jpeg",
										data: base64Image1,
									},
								},
								{
									inlineData: {
										mimeType: "image/jpeg",
										data: base64Image2,
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
					response.data.candidates.map(
						(candidate) => candidate.content.parts[0].text
					)
				)
			);
			console.log(output);
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
			<h1 className="mb-8 text-3xl font-bold">Upload two images</h1>
			<div className="flex justify-center space-x-16 mb-8">
				<input
					type="file"
					onChange={(event) => setImage1(event.target.files[0])}
					accept="image/jpeg, image/png"
					className="p-2 border border-gray-500 rounded-md"
				/>
				<input
					type="file"
					onChange={(event) => setImage2(event.target.files[0])}
					accept="image/jpeg, image/png"
					className="p-2 border border-gray-500 rounded-md"
				/>
			</div>
			<button
				onClick={analyzeImages}
				className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
			>
				Compare Images
			</button>
			<div className="flex justify-center space-x-8">
				<div className="w-1/2">
					{image1 && (
						<img
							src={URL.createObjectURL(image1)}
							alt="Image 1"
							className="max-w-full h-auto"
						/>
					)}
				</div>
				<div className="w-1/2">
					{image2 && (
						<img
							src={URL.createObjectURL(image2)}
							alt="Image 2"
							className="max-w-full h-auto"
						/>
					)}
				</div>
			</div>
			<div className="w-3/4 p-4 my-8 h-96 border border-gray-500 text-gray-900 rounded-md bg-gray-300 shadow-lg overflow-auto whitespace-pre-wrap">
				<div className="markdown-container">
					<ReactMarkdown>{output}</ReactMarkdown>
				</div>
			</div>
		</div>
	);
}

export default CompareAgg;
