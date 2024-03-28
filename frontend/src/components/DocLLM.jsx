import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaFileUpload, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const PDFProcessor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [numPages, setNumPages] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    setPdfPreview(file);
  };

  const renderPDF = (
    <Document file={pdfPreview}>
      {Array.from(new Array(numPages), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} renderMode="canvas" />
      ))}
    </Document>
  );

  const handleUpload = async () => {
    if (!pdfFile) {
      setUploadMessage('Please select a PDF file.');
      return;
    }
    const formData = new FormData();
    formData.append('pdf_file', pdfFile);
    try {
      await axios.post('http://localhost:5007/upload_pdf', formData);
      setUploadMessage('PDF uploaded and processed successfully.');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      // Handle error
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setResponse('Please enter a question.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5007/ask', { question });
      setResponse(response.data.answer);
      setMessages((prevMessages) => [...prevMessages, { question, answer: response.data.answer }]);
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
      // Handle error
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="bg-gray-800 text-white min-h-[91.7vh] flex flex-col">
      <div className="grid grid-cols-2 min-h-[90vh]">
        <div className="p-8 flex flex-col border-r-2 border-gray-600 justify-center items-center">
          <h1 className="text-3xl font-bold mb-4 flex items-center text-gray-200">
            <FaFileUpload className="mr-2 text-blue-400" /> PDF Processor
          </h1>
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md inline-flex items-center cursor-pointer"
            >
              <FaUpload className="mr-2" />
              Upload PDF
            </label>
            <input id="file-upload" type="file" onChange={handleFileChange} accept=".pdf" className="hidden" />
            {uploadMessage && <p className="text-green-500 mt-2">{uploadMessage}</p>}
          </div>
          {pdfPreview ? (
            <div className="mb-4 max-h-full overflow-y-auto">
              <Document file={pdfPreview} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (_, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} renderMode="canvas" />
                ))}
              </Document>
            </div>
          ) : (
            <div className="bg-gray-700 p-8 rounded-lg mb-4 max-w-2xl">
              <h2 className="text-2xl font-semibold mb-4 text-gray-300">Welcome to PDF Processor</h2>
              <p className="mb-4 text-gray-400">
                This application allows you to upload a PDF file and ask questions about its content. The system will
                provide relevant answers based on the information in the PDF.
              </p>
              <p className="mb-4 text-gray-400">
                To get started, click the "Upload PDF" button and select a PDF file from your device. Once the file is
                uploaded, a preview of the PDF will be displayed on the left side of the screen.
              </p>
              <p className="text-gray-400">
                After the PDF is loaded, you can enter your question in the input field on the right side and click the
                paper plane icon to submit your question. The system will process your question and provide a relevant
                answer in the chat area.
              </p>
            </div>
          )}
        </div>
        <div className="p-8 flex flex-col h-[91.7vh] justify-center bg-gray-900">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-200">
            <FaPaperclip className="mr-2 text-blue-400" /> Ask a Question
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg mb-4 h-[90vh] overflow-y-auto flex-grow">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center">No questions asked yet.</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="mb-4">
                  <div className="bg-gray-700 p-2 rounded-md mb-2">
                    <span className="font-semibold text-gray-300">Question:</span> {msg.question}
                  </div>
                  <div className={`bg-gray-700 p-2 rounded-md ${index % 2 === 0 ? 'text-blue-400' : 'text-green-400'}`}>
                    <span className="font-semibold text-gray-300">Answer:</span> {msg.answer}
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleAskQuestion} className="flex">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your question..."
              className="w-full p-2 rounded-l-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-300"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PDFProcessor;