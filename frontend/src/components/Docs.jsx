import React, { useState } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaClipboardCheck } from "react-icons/fa";
import { TiDocumentAdd } from "react-icons/ti";
import { AiOutlineTranslation } from "react-icons/ai";
import ImageAnalysis from "../ImageAnalysis"; // Import the ImageAnalysis component
import DisplayOutput from "../DisplayOutput";
import CompareAgg from "../CompareAgg";

const Docs = () => {
	const [selectedCard, setSelectedCard] = useState(null);

	const handleCardClick = (cardId) => {
		setSelectedCard(cardId);
	};

	const cardData = [
		{
			id: 1,
			title: "Agreement Summary",
			icon: <AiOutlineFileSearch />,
			content: <DisplayOutput />,
		},
		{
			id: 2,
			title: "Compare Agreements ",
			icon: <FaClipboardCheck />,
			content: <CompareAgg />,
		},
		{
			id: 3,
			title: "Document Translation ",
			icon: <TiDocumentAdd />,
			content: "Document Translation",
		},
		{
			id: 4,
			title: "Image to Text ",
			icon: <AiOutlineTranslation />,
			content: <ImageAnalysis />,
		}, // Embed ImageAnalysis component here
	];

	return (
		<div
			className="flex h-[100vh] bg-gray-900 text-white"
			style={{ scrollbarWidth: "1px" }}
		>
			<div className="w-1/4 p-4 rounded-md overflow-auto ">
				{cardData.map((card) => (
					<div
						key={card.id}
						className={`flex h-[23vh] justify-between items-center mb-4  p-2 cursor-pointer border border-gray-700 rounded-md ${
							selectedCard === card.id ? "bg-yellow-600" : ""
						}`}
						onClick={() => handleCardClick(card.id)}
					>
						<h3 className="text-lg font-semibold">{card.title}</h3>
						{card.icon}
					</div>
				))}
			</div>
			<div className="w-3/4 h-full p-4 overflow-auto">
				{selectedCard ? (
					<div>
						<h3 className="text-lg font-semibold">
							{
								cardData.find((card) => card.id === selectedCard)
									.title
							}
						</h3>
						<p>
							{
								cardData.find((card) => card.id === selectedCard)
									.content
							}
						</p>
					</div>
				) : (
					<p>Select a card to see details</p>
				)}
			</div>
		</div>
	);
};

export default Docs;
