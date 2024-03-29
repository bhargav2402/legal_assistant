const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5003;
const multer = require('multer');
const path = require('path');


// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory where you want to store the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Construct a unique filename for the uploaded file
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });

// Route to handle the PDF file upload
app.post('/upload_pdf', upload.single('pdf_file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Do something with the uploaded file, e.g., send it to the backend
  console.log('File uploaded:', req.file.path);

  res.status(200).json({ message: 'File uploaded successfully' });
});


app.use(express.json());
app.use(cors());

app.post("/api/search", async (req, res) => {
	const { formInput, pageNum } = req.body;

	try {
		const response = await fetch(
			`https://api.indiankanoon.org/search/?formInput=${encodeURIComponent(
				formInput
			)}&pagenum=${pageNum}`,
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
