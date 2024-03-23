// src/Trx.js
import React, { useState } from "react";
import { translateDocument } from "@google-cloud/translate";

function Trx() {
	const [documentFile, setDocumentFile] = useState(null);
	const [targetLanguage, setTargetLanguage] = useState("");
	const [translatedDocument, setTranslatedDocument] = useState("");

	const handleFileChange = (event) => {
		setDocumentFile(event.target.files[0]);
	};

	const handleLanguageChange = (event) => {
		setTargetLanguage(event.target.value);
	};

	const translateDocumentHandler = async () => {
		if (!documentFile || !targetLanguage) {
			alert("Please select a document and target language.");
			return;
		}

		try {
			const translation = await translateDocument({
				documentFile,
				targetLanguage,
			});
			setTranslatedDocument(translation);
		} catch (error) {
			console.error("Error translating document:", error);
			alert("Error translating document. Please try again.");
		}
	};

	return (
		<div>
			<h1>Document Translation Trx</h1>
			<input type="file" onChange={handleFileChange} />
			<select value={targetLanguage} onChange={handleLanguageChange}>
				<option value="">Select Target Language</option>
				{/* Add options for target languages */}
			</select>
			<button onClick={translateDocumentHandler}>
				Translate Document
			</button>
			{translatedDocument && (
				<div>
					<h2>Translated Document</h2>
					<p>{translatedDocument}</p>
				</div>
			)}
		</div>
	);
}

export default Trx;
