import React, { useState, useEffect } from "react";

function DisplayOutput() {
	const [output, setOutput] = useState(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await query({
					inputs:
						"The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.",
				});
				setOutput(response);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}

		fetchData();
	}, []);

	return (
		<div>
			<h1>Output:</h1>
			{output ? (
				<pre>{JSON.stringify(output, null, 2)}</pre>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}

async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/ArtifactAI/led_large_16384_billsum_summarization",
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
	return result;
}

export default DisplayOutput;
