import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
  ];

  const handleSubmit = async () => {
    setError('');
    setResponse(null);
    try {
      // Validate and parse JSON input
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
        if (typeof parsedData !== 'object' || !Array.isArray(parsedData.data)) {
          throw new Error('Invalid JSON format. Please provide an array of strings under the "data" key.');
        }
      } catch (err) {
        throw new Error('Invalid JSON format. Please provide a valid JSON object.');
      }

      // Call the API
      const res = await axios.post('http://127.0.0.1:5000/bfhl', parsedData);
      setResponse(res.data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  const renderResponse = () => {
    if (!response) return null;
    const filteredResponse = {};
    if (selectedOptions.some(option => option.value === 'alphabets')) {
      filteredResponse.alphabets = response.alphabets;
    }
    if (selectedOptions.some(option => option.value === 'numbers')) {
      filteredResponse.numbers = response.numbers;
    }
    if (selectedOptions.some(option => option.value === 'highest_lowercase_alphabet')) {
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }
    return (
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API input</h1> {/* Replace with your roll number */}
      <input
        type="text"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON'
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      <Select
        isMulti
        options={options}
        onChange={setSelectedOptions}
        style={{ marginTop: '20px', width: '300px' }}
      />
      {renderResponse()}
    </div>
  );
}

export default App;
