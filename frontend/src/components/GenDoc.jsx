import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const GenDoc = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    date: '',
    requirements: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const { name, address, date, requirements } = formData;

    // Add content to the PDF
    doc.setFontSize(12);
    doc.text(`Legal Document`, 10, 10);
    doc.text(`Name: ${name}`, 10, 20);
    doc.text(`Address: ${address}`, 10, 30);
    doc.text(`Date: ${date}`, 10, 40);
    doc.text(`Requirements:`, 10, 50);
    doc.text(requirements, 10, 60);

    // Save the PDF
    doc.save('legal_document.pdf');
  };

  return (
    <div>
      <h1>Generate Legal Document</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Requirements:</label>
          <textarea name="requirements" value={formData.requirements} onChange={handleChange} required />
        </div>
        <button type="submit">Generate PDF</button>
      </form>
    </div>
  );
};

export default GenDoc;
