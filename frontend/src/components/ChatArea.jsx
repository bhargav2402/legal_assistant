import React, { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { GiAtomicSlashes } from "react-icons/gi";
import { AnimatePresence, motion } from "framer-motion";
import promptsData from "../prompts.json";

const renderAIMessage = (message) => {
	return message.split("\n\n").flatMap((paragraph, index) => (
		<React.Fragment key={index}>
			{paragraph.split("\n").map((line, i, arr) => (
				<p key={i}>{line}</p>
			))}
			{index !== message.split("\n\n").length - 1 && <br />}{" "}
		</React.Fragment>
	));
};

const Message = ({ author, content }) => {
	const Icon = author === "You" ? FaUser : GiAtomicSlashes;

	return (
		<div
			className={`mb-2 rounded p-5 ${
				author === "You" ? "bg-gray-100/40" : "bg-gray-100/40"
			}`}
		>
			<div className="font-bold flex items-center gap-2 text-xl">
				{" "}
				<div className="text-white bg-black rounded-full p-1">
					<Icon size={14} />
				</div>
				{author}:
			</div>
			<p>{renderAIMessage(content)}</p>
		</div>
	);
};

export const ChatArea = ({
	chatHistory,
	loading,
	setUserQuestion,
	handleSend,
}) => {
	const messagesEndRef = useRef(null);
	const [randomPrompts, setRandomPrompts] = useState([]);

	useEffect(() => {
		const shuffledPrompts = promptsData.sort(
			() => 0.5 - Math.random()
		);
		const selectedPrompts = shuffledPrompts.slice(0, 4);
		setRandomPrompts(selectedPrompts);
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handlePrompt = (heading, addition) => {
		setUserQuestion(`${heading} ${addition}`);
		handleSend();
	};

	useEffect(() => {
		scrollToBottom();
	}, [chatHistory]);

	return (
		<div className="flex-1 lg:mx-36 mx-5 overflow-y-auto p-4">
			<AnimatePresence>
				{!loading && chatHistory.length === 0 && (
					<div className="flex flex-col h-full items-center justify-between">
						<div></div>
						<div className="flex flex-col gap-6 items-center">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								exit={{ scale: 0 }}
								transition={{ duration: 0.6 }}
								className="text-white bg-black rounded-full p-3"
							>
								<GiAtomicSlashes size={30} />
							</motion.div>
							<motion.div
								initial={{ x: -2000, scale: 0 }}
								animate={{ x: 0, scale: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.6 }}
								className="font-semibold text-lg md:text-2xl mb-2"
							>
								How can I help you today?
							</motion.div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 w-full lg:grid-cols-2 gap-2">
							{randomPrompts.map((prompt, index) => (
								<AnimatePresence key={index}>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										exit={{ opacity: 0 }}
										transition={{
											duration: 0.5,
											staggerChildren: 0.1,
										}}
										className="text-sm lg:p-4 p-3 cursor-pointer transition-all duration-300 hover:shadow-md rounded-lg border border-gray-200"
										onClick={() =>
											handlePrompt(prompt.heading, prompt.addition)
										}
									>
										<div className="font-semibold">
											{prompt.heading}
										</div>
										<div className="text-gray-400 font-semibold">
											{prompt.addition}
										</div>
									</motion.div>
								</AnimatePresence>
							))}
						</div>
					</div>
				)}
			</AnimatePresence>
			{chatHistory.map((message, index) => (
				<Message
					key={index}
					author={message.author}
					content={message.content}
				/>
			))}
			{loading && (
				<div className="flex justify-center mt-2">
					<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
				</div>
			)}
			<div
				style={{ float: "left", clear: "both" }}
				ref={messagesEndRef}
			></div>
		</div>
	);
};
