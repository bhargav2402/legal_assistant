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
             "Bearer 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",
         },
         method: "POST",
         body: JSON.stringify(data),
       }
     );

     const result = await response.json();
     setApiResponse(JSON.stringify(result, null, 2));
     console.log(result);
     const firstScoreValue = result.scores[0];
     const firstLabelValue = result.labels[0];
     return { firstScoreValue, firstLabelValue };
   } catch (error) {
     console.error("Error fetching data:", error);
   }
 };

 const handleButtonClick = async () => {
   const result1 = await queryAPI([
     "Case Accepted",
     "Case Rejected",
   ]);
   setFirstScore(result1.firstScoreValue);
   setFirstLabel(result1.firstLabelValue);

   const result2 = await queryAPI(["Accused won", "Accused lost"]);
   setSecondScore(result2.firstScoreValue);
   setSecondLabel(result2.firstLabelValue);
 };

 return (
   <div className="min-h-[91vh]  bg-gray-800 text-gray-100">
     <div className="container max-w-4xl mx-auto px-3 py-8">
       <h1 className="text-3xl font-bold mb-4 text-center animate-fade-in">
         Prediction Component
       </h1>
       <p className="text-lg text-center mb-4 animate-fade-in delay-300">
         This component uses a machine learning model to predict labels based on user input. It queries an API with the user's input and candidate labels, and the API returns the predicted labels and their scores. The labels with the highest scores are the model's predictions.
       </p>
       <div className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 animate-slide-up">
         <div className="mb-4">
           <label
             className="block text-gray-200 text-sm font-bold mb-2"
             htmlFor="message"
           >
             Enter your message
           </label>
           <input
             className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 bg-gray-700"
             id="message"
             type="text"
             value={userInput}
             onChange={handleInputChange}
             placeholder="Enter your message..."
           />
         </div>
         <div className="flex items-center justify-between">
           <button
             className="bg-blue-500 text-center flex m-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
             type="button"
             onClick={handleButtonClick}
           >
             <i className="fas fa-robot mr-2"></i> Evaluate
           </button>
         </div>
       </div>
       <div className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 animate-slide-up delay-300">
         <h2 className="block text-gray-300 text-sm font-bold mb-2">
           Predicted Labels:
         </h2>
         <ul className="list-disc list-inside">
           <li className="animate-fade-in delay-500">
             {firstLabel || "Nothing to predict"}
           </li>
           <li className="animate-fade-in delay-700">
             {secondLabel || "Nothing to predict"}
           </li>
         </ul>
       </div>
       <div className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mt-4 animate-slide-up delay-600">
         <h2 className="block text-gray-300 text-sm font-bold mb-2">
           How does it work?
         </h2>
         <p className="text-gray-300 text-base animate-fade-in delay-900">
           This prediction component works by sending your input to a machine learning model hosted on a server. The model has been trained on a large amount of data and can predict labels based on the patterns it has learned from that data. When you click "Evaluate", the component sends your input to the model and receives the predicted labels in response. These labels are then displayed on the screen.
         </p>
       </div>
     </div>
     <footer className="bg-gray-900 mt-9 py-4">
       <div className="container mx-auto px-4 text-center text-gray-300">
         &copy; 2023 Codecatalysts
       </div>
     </footer>
   </div>
 );
}

export default PredictionComponent;