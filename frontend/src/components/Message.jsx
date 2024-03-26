import React from "react";

const Message = ({ text, fromUser }) => {
	const messageStyle = fromUser
		? "bg-blue-900 text-white self-end"
		: "bg-gray-300 text-black self-start";

	return (
		<div className={`p-2 mb-2 rounded-lg max-w-md ${messageStyle}`}>
			<p className="break-words">{text}</p>
		</div>
	);
};

export default Message;
