import React, { useState } from "react";
import DisplayOutput from "../DisplayOutput";
import CompareAgg from "../CompareAgg";
import ImageToTextConverter from "./Translate";
import ImageAnalysis from "../ImageAnalysis";

const Docs = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
  };

  const cardData = [
    {
      id: 1,
      title: "Agreement Summary",
      description: (
        <div className="text-gray-700">
          <p className="mb-2">
            <span className="font-bold">Unlock the power of NLP:</span> Gain
            comprehensive summaries of legal agreements, with key terms,
            clauses, and provisions highlighted.
          </p>
          <p>
            <span className="font-bold">Streamline your workflow:</span> Save
            time by quickly understanding the essence of complex documents.
          </p>
        </div>
      ),
      content: <DisplayOutput />,
    },
    {
      id: 2,
      title: "Compare Agreements",
      description: (
        <div className="text-gray-700">
          <p className="mb-2">
            <span className="font-bold">Spot the differences:</span> Compare
            multiple agreements side-by-side, identifying similarities,
            differences, and potential conflicts.
          </p>
          <p>
            <span className="font-bold">Enhance your analysis:</span> Leverage
            this powerful tool to ensure consistency and mitigate risks.
          </p>
        </div>
      ),
      content: <CompareAgg />,
    },
    {
      id: 3,
      title: "Document Translation",
      description: (
        <div className="text-gray-700">
          <p className="mb-2">
            <span className="font-bold">Break language barriers:</span>{" "}
            Accurately translate legal documents between various languages,
            preserving technical terms and legal jargon.
          </p>
          <p>
            <span className="font-bold">Expand your reach:</span> Collaborate
            with global partners and clients without limitations.
          </p>
        </div>
      ),
      content: <ImageToTextConverter />,
    },
    {
      id: 4,
      title: "Image to Text",
      description: (
        <div className="text-gray-700">
          <p className="mb-2">
            <span className="font-bold">Digitize with ease:</span> Extract text
            from images and PDF documents, enabling efficient data entry and
            digitization of paper-based legal documents.
          </p>
          <p>
            <span className="font-bold">Streamline your workflow:</span>{" "}
            Transform physical documents into searchable, editable digital
            formats.
          </p>
        </div>
      ),
      content: <ImageAnalysis />,
    },
  ];

  const legalTips = [
    "Always read and understand a contract before you sign it.",
    "Keep a copy of all legal documents you sign.",
    "When in doubt, consult with a legal professional.",
    "Understand the laws that pertain to your business.",
    "Protect your intellectual property with patents, trademarks, and copyrights."
  ];

  return (
    <div className="flex max-h-[91.6vh] bg-gray-100 text-gray-800">
      <div className="w-1/3 h-[91.5vh] bg-gray-200 p-3 overflow-y-hidden">
        {cardData.map((card) => (
          <div
            key={card.id}
            className={`mb-5 p-4 mt-2 cursor-pointer border border-gray-400 rounded-md transition-all duration-300 transform hover:scale-[1.02] ${
              selectedCard === card.id
                ? "bg-gray-400 text-white shadow-md"
                : "bg-white hover:bg-gray-200"
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <h3 className="text-xl font-semibold mb-2">
              {card.title}
            </h3>
            {card.description}
          </div>
        ))}
      </div>
      <div className="w-2/3 p-6 overflow-y-auto bg-gray-100">
        {selectedCard ? (
          <div className="transition-opacity duration-500">
            {/* <h3 className="text-3xl text-center border-b-2 pt-0 py-2 border-b-gray-700 justify-center font-semibold text-gray-800">
              {cardData.find((card) => card.id === selectedCard).title}
            </h3> */}
            {cardData.find((card) => card.id === selectedCard).content}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Welcome to the Document Processing Tool</h2>
            <p className="text-lg mb-4">Please select a tool from the left panel to get started.</p>
            <div className="mt-4 p-6 w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
              <h3 className="text-xl font-bold mb-2">Legal Tips:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {legalTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Docs;
