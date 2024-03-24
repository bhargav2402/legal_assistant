import React, { useState } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaClipboardCheck } from "react-icons/fa";
import { TiDocumentAdd } from "react-icons/ti";
import { AiOutlineTranslation } from "react-icons/ai";
import ImageAnalysis from "../ImageAnalysis"; 
import DisplayOutput from "../DisplayOutput";
import CompareAgg from "../CompareAgg";
import ImageToTextConverter from "./Translate";

const Docs = () => {
	const [selectedCard, setSelectedCard] = useState(null);

	const handleCardClick = (cardId) => {
		setSelectedCard(cardId);
	};

	const cardData = [
		{
			id: 1,
			title: "Agreement Summary",
			icon: <AiOutlineFileSearch className="text-6xl" />,
			content: <DisplayOutput />,
		},
		{
			id: 2,
			title: "Compare Agreements ",
			icon: <FaClipboardCheck className="text-6xl" />,
			content: <CompareAgg />,
		},
		{
			id: 3,
			title: "Document Translation ",
			icon: <TiDocumentAdd className="text-6xl" />,
			content: <ImageToTextConverter />,
		},
		{
			id: 4,
			title: "Image to Text ",
			icon: <AiOutlineTranslation className="text-6xl" />,
			content: <ImageAnalysis />,
		},
	];

	return (
		<div
			className="flex h-[93vh] bg-gray-200 text-gray-900"
			style={{ scrollbarWidth: "0px" }}
		>
			<div className="w-1/4 p-3 rounded-md overflow-auto">
				{cardData.map((card) => (
					<div
						key={card.id}
						className={`flex h-[21vh] justify-between items-center mb-4 p-2 cursor-pointer border border-gray-500 rounded-md ${
							selectedCard === card.id ? "bg-gray-400" : ""
						}`}
						onClick={() => handleCardClick(card.id)}
					>
						<h3 className="text-2xl font-semibold text-center">{card.title}</h3>
						<span className="text-3xl" style={{height:'3rem'}}>{card.icon}</span>
					</div>
				))}
			</div>
			<div className="w-3/4 h-full p-3 overflow-y-auto bg-gray-100 text-gray-900">
				{selectedCard ? (
					<div className="">
						<h3 className="text-3xl text-center border-b-2 pt-0 py-2 border-b-gray-700 justify-center font-semibold">
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
