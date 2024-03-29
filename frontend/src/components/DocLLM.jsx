import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaUpload, FaFileUpload, FaPaperclip, FaPaperPlane, FaChevronLeft, FaChevronRight, FaArrowDown } from 'react-icons/fa';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFProcessor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const pdfContainerRef = useRef(null);
  const componentRef = useRef(null);

  useEffect(() => {
    const componentElement = componentRef.current;
    if (componentElement) {
      componentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    setPdfPreview(URL.createObjectURL(file));
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      setUploadMessage('Please select a PDF file.');
      return;
    }
  
    const formData = new FormData();
    formData.append('pdf_file', pdfFile);
  
    try {
      const response = await axios.post('/upload_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        setUploadMessage('PDF uploaded and processed successfully.');
      } else {
        setUploadMessage('Error uploading PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
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
    }
  };

  const scrollToBottom = () => {
    const pdfContainer = pdfContainerRef.current;
    if (pdfContainer) {
      pdfContainer.scrollTop = pdfContainer.scrollHeight;
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col" ref={componentRef}>
      <div className="grid grid-cols-2 flex-grow">
        <div className="p-8 flex relative flex-col border-r-2 mb-2 border-gray-600 justify-between">
          <div className="flex mx-auto flex-col items-center">
            <div className="flex items-center mx-auto mb-4">
              <h1 className="text-3xl font-bold flex mx-auto items-center text-gray-200">
                <FaFileUpload className="mr-2 text-blue-400" /> PDF Processor
              </h1>
              {pdfPreview && (
                <button
                  onClick={handleUpload}
                  htmlFor="file-upload"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md inline-flex items-center cursor-pointer ml-72"
                >
                  <FaUpload className="mr-2" />
                  Analyze pdf
                </button>
              )}
            </div>
            {!pdfPreview && (
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
            )}
          </div>
          {pdfPreview ? (
            <div >
                <div className="mb-2 w-5/6 mx-auto max-h-[79vh] overflow-y-auto" ref={pdfContainerRef}>
              <Document file={pdfPreview} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={currentPage} scale={1} />
              </Document>
              </div>
              <div className="flex items-center mb-2 justify-center mt-4">
                <button
                  className="bg-blue-600  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mr-2 "
                  onClick={handlePrevPage}
                >
                  <FaChevronLeft className="mr-1" />
                </button>
                <span>{currentPage} / {numPages}</span>
                <button
                  className="bg-blue-600 ml-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md "
                  onClick={handleNextPage}
                >
                  <FaChevronRight className="ml-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-700 w-5/6 mx-auto my-auto  p-8 rounded-lg  max-w-2xl">
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
          <button
            onClick={scrollToBottom}
            className="bg-blue-600 absolute bottom-2 hover:bg-blue-700 mb-2 text-white font-bold py-2 px-4 rounded-md self-start"
          >
            <FaArrowDown />
          </button>
        </div>
        <div className="p-8 flex flex-col justify-between h-full bg-gray-900">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-200">
            <FaPaperclip className="mr-2 text-blue-400" /> Ask a Question
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg mb-4 flex-grow overflow-y-auto">
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