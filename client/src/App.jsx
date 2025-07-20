import React, { useState } from 'react';
import './index.css';
import ImageCropper from './components/Cropper';
import Tesseract from 'tesseract.js';
import UrlInput from './components/UrlInput';
import ImageUploader from './components/ImageUploader';

function App() {
  const [image, setImage] = useState(null);
  const [link, setLink] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageURL, setTempImageURL] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const extractTextFromImage = async () => {
    if (!image) {
      alert('No image selected');
      return;
    }

    setLoading(true);

    try {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (m) => console.log(m),
      });

      const extractedText = result.data.text.trim();
      setText(extractedText);
      setLoading(false);

      if (extractedText && extractedText.length > 5) {
        sendTextToAI(extractedText);
      } else {
        setResult('No readable or valid text found. Please try cropping better or upload a clearer image.');
      }
    } catch (err) {
      console.error('❌ Tesseract error:', err.message);
      setResult('OCR failed.');
      setLoading(false);
    }
  };


  
  const sendTextToAI = async (extractedText) => {
    setAiLoading(true);
    try {
      const res = await fetch('https://meme-backend.onrender.com/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error contacting backend:', error);
      setResult('⚠️ Failed to connect to AI service. Please try again later or check your server.');
    }

    setAiLoading(false);
  };

  const handleCheckFact = async () => {
    if (image) {
      extractTextFromImage();
    } else if (link) {
      setLoading(true);
      setText('');
      setResult('');
      try {
        const res = await fetch('https://meme-backend.onrender.com/api/extract-from-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: link }),
        });

        const data = await res.json();

        if (res.ok && data.text) {
          const extractedText = data.text.trim();
          setText(extractedText);

          if (extractedText.length > 5) {
            sendTextToAI(extractedText);
          } else {
            setResult('No readable text found. Try another image or crop.');
          }
        } else {
          setResult('Failed to extract text from URL.');
        }
      } catch (err) {
        console.error('❌ Error extracting from URL:', err.message);
        setResult('Error contacting backend. Make sure your server is running.');
      }

      setLoading(false);
    } else {
      alert('Please upload a meme or paste a link.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md sm:max-w-xl text-white shadow-xl">
        <h1 className="text-3xl font-bold text-center text-cyan-300 mb-6 drop-shadow-md">
          Meme Fact Checker
        </h1>

        <ImageUploader
          onImageSelected={(tempURL, file) => {
            setTempImageURL(tempURL);
            setImage(file);
            setShowCropper(true);
            setLink('');
            setText('');
            setResult('');
          }}
        />

        <UrlInput link={link} setLink={setLink} />

        <button
          onClick={handleCheckFact}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm sm:text-base cursor-pointer"
        >
          Analyze Fact
        </button>

        {loading && (
          <p className="mt-4 text-center text-sm text-gray-300">Reading meme text...</p>
        )}

        {aiLoading && (
          <div className="mt-4 flex justify-center items-center gap-2 text-cyan-200 text-sm">
            <svg className="animate-spin h-5 w-5 text-cyan-300" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <circle className="opacity-75" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"
                strokeDasharray="60" strokeDashoffset="20" fill="none" />
            </svg>
            Analyzing with AI...
          </div>
        )}

        {text && (
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded border border-cyan-500">
            <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center justify-between">
              📝 Extracted Text:
              {!isEditing && (
                <button
                  className="text-cyan-300 text-xs underline hover:text-cyan-100 transition"
                  onClick={() => {
                    setIsEditing(true);
                    setEditedText(text);
                  }}
                >
                  Edit
                </button>
              )}
            </h3>

            {isEditing ? (
              <>
                <textarea
                  className="w-full p-2 bg-black/50 text-white rounded border border-cyan-400"
                  rows={4}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    className="px-3 py-1 bg-cyan-600 text-white rounded text-sm"
                    onClick={() => {
                      setText(editedText);
                      setIsEditing(false);
                      setResult('');
                      sendTextToAI(editedText);
                    }}
                  >
                    Save & Re-Check
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm whitespace-pre-line text-white">{text}</p>
            )}
          </div>
        )}

        {result && (
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded border border-green-400">
            <h3 className="text-sm font-semibold text-green-300 mb-1">✅ Fact Check Result:</h3>
            <p className="text-sm whitespace-pre-line text-white">{result}</p>
          </div>
        )}

        {showCropper && tempImageURL && (
          <ImageCropper
            imageSrc={tempImageURL}
            onCropComplete={(croppedBlob) => {
              const croppedFile = new File([croppedBlob], 'cropped.jpg', {
                type: 'image/jpeg',
              });
              setImage(croppedFile);
            }}
            onClose={() => setShowCropper(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
