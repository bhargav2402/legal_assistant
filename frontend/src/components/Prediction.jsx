import React, { useState } from "react";

function PredictionComponent() {
	const [apiResponse, setApiResponse] = useState("");
	const [userInput, setUserInput] = useState("");
	const [firstScore, setFirstScore] = useState("");
	const [firstLabel, setFirstLabel] = useState("");
	const [secondScore, setSecondScore] = useState("");
	const [secondLabel, setSecondLabel] = useState("");

	const handleInputChange = (event) => {
		setUserInput(event.target.value);
	};

	const queryAPI = async (labels) => {
		const data = {
			inputs: userInput,
			parameters: {
				candidate_labels: labels,
			},
		};

		try {
			const response = await fetch(
				"https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
				{
					headers: {
						Authorization:
							"Bearer YOUR_HUGGING_FACE_TOKEN_HERE",
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
			return { firstScoreValue, firstLabelValue };
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleButtonClick = async () => {
		const result1 = await queryAPI(["Case Accepted", "Case Rejected"]);
		setFirstScore(result1.firstScoreValue);
		setFirstLabel(result1.firstLabelValue);

		const result2 = await queryAPI(["Accused won", "Accused lost"]);
		setSecondScore(result2.firstScoreValue);
		setSecondLabel(result2.firstLabelValue);
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h1 className="text-2xl font-bold mb-4">Predict</h1>
			<div className="w-full max-w-xl min-h-2xl flex justify-center mb-4">
				<input
					type="text"
					value={userInput}
					onChange={handleInputChange}
					placeholder="Enter your message..."
					className="border border-gray-500 rounded-l-md px-4 py-2 w-full"
				/>
				<button
					onClick={handleButtonClick}
					className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
				>
					Evaluate
				</button>
			</div>
			<div className="w-full max-w-lg flex flex-col items-center">
				<p className="text-lg font-bold">Predicted Labels:</p>
				<p className="text-base">{firstLabel}</p>
				<p className="text-base">{secondLabel}</p>
			</div>
		</div>
	);
}

export default PredictionComponent;
