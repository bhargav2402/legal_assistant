import React from "react";
import { IoSendSharp } from "react-icons/io5";

export function MessageInput({ userQuestion, setUserQuestion, handleSend }) {
  const isSendDisabled = userQuestion.trim() === "";

  return (
    <div className="p-4 lg:mx-36 flex items-center">
      <input
        value={userQuestion}
        onChange={(e) => setUserQuestion(e.target.value)}
        placeholder="Ask CodeCatalysts..."
        className="flex-1 border border-gray-600 bg-gray-700 text-gray-300 rounded-lg p-2 mr-2"
      />
      <button
        onClick={handleSend}
        disabled={isSendDisabled}
        className={`bg-gray-600 hover:bg-gray-500 transition-all duration-300 text-gray-200 font-bold py-3 px-4 rounded-lg ${
          isSendDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <IoSendSharp size={19} />
      </button>
    </div>
  );
}