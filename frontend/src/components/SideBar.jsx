import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { GiAtomicSlashes } from "react-icons/gi";
import { MdOutlineInput } from "react-icons/md";

function Sidebar({
	model,
	setModel,
	conversationalMemoryLength,
	setConversationalMemoryLength,
}) {
	const [isOpen, setIsOpen] = useState(true);
	const [isPressed, setIsPressed] = useState(false);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
		setIsPressed(true); // Set the pressed state to true when toggling the sidebar
		setTimeout(() => setIsPressed(false), 500); // Reset the pressed state after 500ms
	};

	const handleRefresh = () => {
		window.location.reload(); // Refreshing the page
	};

	useEffect(() => {
		// Check if the window width is less than a certain breakpoint (e.g., 768px for mobile devices)
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setIsOpen(false); // Close the sidebar by default on mobile devices
			}
		};

		handleResize(); // Call the function initially to set the state based on the window width

		window.addEventListener("resize", handleResize); // Listen for resize events
		return () => window.removeEventListener("resize", handleResize); // Clean up the event listener
	}, []);

	return (
		<div
			className={`bg-gray-100 p-4 flex flex-col items-center ${
				isOpen ? "w-64" : "lg:w-16 w-0 p-1"
			} transition-all duration-500 ease-in-out`}
		>
			<button
				onClick={toggleSidebar}
				className="self-start py-2 mb-2"
			>
				{isOpen ? (
					<FaAngleLeft
						size={30}
						className={`angle-icon ${
							isPressed ? "rotate-left" : ""
						}`}
					/>
				) : (
					<FaAngleRight
						size={30}
						className={`angle-icon ${
							isPressed ? "rotate-right" : ""
						}`}
					/>
				)}
			</button>
			<div
				className={`transition-opacity duration-700 ${
					isOpen ? "opacity-100" : "opacity-0"
				} overflow-hidden`}
			>
				{isOpen && (
					<>
						<button
							onClick={handleRefresh}
							className=" hover:bg-gray-300/70 bg-gray-200 flex justify-between w-full p-2 items-center text-gray-900 font-semibold py-3 transition-all duration-300 rounded-lg"
						>
							{" "}
							<div className="flex gap-2">
								<div className="text-white bg-gray-900 rounded-full p-1">
									<GiAtomicSlashes size={15} />
								</div>
								Ask here
							</div>
							<MdOutlineInput size={20} />
						</button>
						<h2 className="text-lg font-semibold mt-10 mb-4">
							Settings
						</h2>
						<div className="mb-4">
							<label
								htmlFor="modelSelect"
								className="mr-2  font-semibold"
							>
								Model:
							</label>
							<select
								id="modelSelect"
								value={model}
								onChange={(e) => setModel(e.target.value)}
								className="border border-gray-300 rounded-lg my-1 p-2 w-52"
							>
								<option value="llama2-70b-4096">Llama2 70b</option>
								<option value="mixtral-8x7b-32768">
									Mixtral 8x7b
								</option>
							</select>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default Sidebar;
