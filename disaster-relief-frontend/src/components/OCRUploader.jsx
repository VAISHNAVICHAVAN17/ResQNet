import React, { useState } from 'react';

function OCRUploader() {
  const [file, setFile] = useState(null);
  const [resultText, setResultText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadAndExtract = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setError(null);
    setLoading(true);
    setResultText('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8088/api/ocr/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResultText(data.text);
    } catch (err) {
      setError('Failed to extract text: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Image for OCR</h2>
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button onClick={uploadAndExtract} disabled={loading}>
        {loading ? 'Extracting...' : 'Extract Text'}
      </button>

      {error && <p style={{color: 'red'}}>{error}</p>}
      {resultText && (
        <div>
          <h3>OCR Result</h3>
          <pre>{resultText}</pre>
        </div>
      )}
    </div>
  );
}

export default OCRUploader;
