import React, { useState } from "react";

function PredictionComponent() {
	const [apiResponse, setApiResponse] = useState("");
	const [userInput, setUserInput] = useState("");
	const [firstScore, setFirstScore] = useState("");
	const [firstLabel, setFirstLabel] = useState("");

	const handleInputChange = (event) => {
		setUserInput(event.target.value);
	};

	const queryAPI = async () => {
		const data = {
			inputs: userInput,
			parameters: {
				candidate_labels: ["Case Accepted", "Case Rejected"],
			},
		};

		try {
			const response = await fetch(
				"https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
				{
					headers: {
						Authorization:
							"Bearer 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",
					},
					method: "POST",
					body: JSON.stringify(data),
				}
			);

			const result = await response.json();
			setApiResponse(JSON.stringify(result, null, 2));
			console.log(result);
			// Extracting first value of scores and labels
			const firstScoreValue = result.scores[0];
			const firstLabelValue = result.labels[0];
			setFirstScore(firstScoreValue);
			setFirstLabel(firstLabelValue);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	return (
		<div className="container" style={{ textAlign: "center" }}>
			<h1>React API Call</h1>
			<input
				type="text"
				value={userInput}
				onChange={handleInputChange}
				placeholder="Enter your message"
			/>
			<button onClick={queryAPI}>Call API</button>
			{/* <pre>{apiResponse}</pre> */}
			{/* <p>First Score: {firstScore}</p> */}
			<p>Predicted Label: {firstLabel}</p>
		</div>
	);
}

export default PredictionComponent;
