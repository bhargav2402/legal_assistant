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
       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=YOUR_GOOGLE_API_KEY_HERE`,
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
   <div className="min-h-screen bg-gray-800 text-gray-300 flex flex-col items-center justify-center p-8">
     <h1 className="text-4xl font-bold mb-4">Image to Text Conversion</h1>
     <div className="bg-gray-700 rounded-lg shadow-md p-6 mb-8">
       <h2 className="text-2xl font-semibold mb-4">How to Use:</h2>
       <ol className="list-decimal list-inside">
         <li>Upload an image containing text (handwritten or printed).</li>
         <li>Click the "Open" button or drag and drop the image file.</li>
         <li>
           Our AI will analyze the image and accurately transcribe the text
           into plain text format.
         </li>
         <li>
           The transcribed text will be displayed in the output section below,
           preserving details like handwriting style, font, layout, and unique
           features.
         </li>
       </ol>
       <h2 className="text-2xl font-semibold mt-6 mb-4">Expected Output:</h2>
       <p>
         A precise transcription of the text contained in the image, including:
       </p>
       <ul className="list-disc list-inside">
         <li>Accurate conversion of handwritten or printed text</li>
         <li>Preservation of layout and formatting</li>
         <li>
           Detailed description of handwriting style, font, and other unique
           features
         </li>
         <li>
           Faithful representation of the original content in plain text format
         </li>
       </ul>
     </div>
     <input
       type="file"
       onChange={analyzeImage}
       accept="image/jpeg, image/png"
       className="mb-8 px-4 py-2 border border-gray-600 rounded-md"
     />
     <div className="w-full max-w-4xl p-6 bg-gray-700 rounded-md overflow-auto whitespace-pre-wrap">
       <h1 className="text-xl font-semibold mb-2">Output:</h1>
       <div className="markdown-container">
         <ReactMarkdown>{output}</ReactMarkdown>
       </div>
     </div>
   </div>
 );
}

export default ImageAnalysis;