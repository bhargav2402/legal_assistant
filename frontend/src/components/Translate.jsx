import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ImageToTextConverter = () => {
  const [output, setOutput] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [targetLang, setTargetLang] = useState('es');

  const API_KEY = 'AIzaSyBeWedYJarTwFhzhLWPHqaRwJQaMC3gU4g';

  useEffect(() => {
    const fetchSupportedLanguages = async () => {
      try {
        const response = await axios.get('https://translation.googleapis.com/language/translate/v2/languages', {
          params: {
            key: API_KEY,
          },
        });
        setSupportedLanguages(response.data.data.languages);
      } catch (error) {
        console.error('Error fetching supported languages:', error.response?.data || error.message);
        setError('Failed to fetch supported languages.');
      }
    };

    fetchSupportedLanguages();
  }, [API_KEY]);

  async function analyzeImage(event) {
    const file = event.target.files[0];
    if (!file) {
      alert('Please select an image file.');
      return;
    }

    try {
      const base64Image = await convertImageToBase64(file);
      const text = await performOCR(base64Image);
      setOutput(`\`\`\`markdown\n${text}\n\`\`\``);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setError('Error processing image. Please try again.');
    }
  }

  async function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async function performOCR(base64Image) {
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-vision-latest:generateContent',
        {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
            stopSequences: [],
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('OCR Error:', error.response?.data || error.message);
      throw new Error('OCR failed. Please try again.');
    }
  }

  async function translateText(text, sourceLang, targetLang) {
    try {
      const response = await axios.post(
        'https://translation.googleapis.com/language/translate/v2',
        {
          q: text,
          source: sourceLang,
          target: targetLang,
          key: API_KEY,
        }
      );
      setTranslatedText(response.data.data.translations[0].translatedText);
    } catch (error) {
      console.error('Translation Error:', error.response?.data || error.message);
      setError('Translation failed. Please try again.');
    }
  }

  const handleLanguageChange = (event) => {
    setTargetLang(event.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 text-gray-900">
      <h1 className="text-3xl font-bold mb-8">Language Translation</h1>
      <input type="file" onChange={analyzeImage} accept=".jpg, .jpeg, .png" className="mb-4" />
      {output && (
        <div className="mt-8 p-4 border border-gray-500 rounded">
          <h2 className="text-xl font-bold mb-2">Extracted Text:</h2>
          <ReactMarkdown>{output}</ReactMarkdown>
          <div className="mt-4">
            <label htmlFor="targetLang" className="font-bold mr-2">
              Translate to:
            </label>
            <select id="targetLang" value={targetLang} onChange={handleLanguageChange} className="border border-gray-400 rounded p-1">
              {supportedLanguages.map((lang) => (
                <option key={lang.language} value={lang.language}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => translateText(output.replace(/`/g, ''), 'en', targetLang)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Translate
            </button>
          </div>
        </div>
      )}
      {translatedText && (
        <div className="mt-8 p-4 border border-gray-500 rounded">
          <h2 className="text-xl font-bold mb-2">Translated Text:</h2>
          <ReactMarkdown>{`\`\`\`markdown\n${translatedText}\n\`\`\``}</ReactMarkdown>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ImageToTextConverter;