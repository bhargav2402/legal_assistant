import React from "react";
import { IoSendSharp } from "react-icons/io5";

export function MessageInput({
	userQuestion,
	setUserQuestion,
	handleSend,
}) {
	const isSendDisabled = userQuestion.trim() === ""; 

	return (
		<div className="p-4 lg:mx-36 flex items-center">
			<input
				value={userQuestion}
				onChange={(e) => setUserQuestion(e.target.value)}
				placeholder="Ask CodeCatalysts..."
				className="flex-1 border border-gray-500 rounded-lg p-2 mr-2"
			/>
			<button
				onClick={handleSend}
				disabled={isSendDisabled} 
				className={`bg-gray-900 hover:bg-gray-800 transition-all duration-300 text-gray-100 font-bold py-3 px-4 rounded-lg ${
					isSendDisabled ? "opacity-50 cursor-not-allowed" : ""
				}`} 
			>
				<IoSendSharp size={19} />
			</button>
		</div>
	);
}
