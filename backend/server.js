const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.post("/api/search", async (req, res) => {
	const { formInput } = req.body;
	const { pageNo } = req.body;

	try {
		const response = await fetch(
			`https://api.indiankanoon.org/search/?formInput=${encodeURIComponent(
				formInput
			)}&pagenum=${encodeURIComponent(pageNo)}`,
			{
				method: "POST",
				headers: {
					Authorization:
						"Token 9897924575b2f0a61ecbf69507a961f346453bde",
				},
			}
		);

		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error("Error fetching data:", error);
		res
			.status(500)
			.json({ error: "An error occurred while fetching data." });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
