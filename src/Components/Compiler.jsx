import React, { useState, useEffect } from 'react';
import '../Compiler.css';

const Compiler = () => {
  const [input, setInput] = useState(localStorage.getItem('input') || '');
  const [output, setOutput] = useState('');
  const [languageId, setLanguageId] = useState(localStorage.getItem('language_Id') || '71');
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('input', input);
    localStorage.setItem('language_Id', languageId);
  }, [input, languageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOutput('Creating Submission...\n');

    try {
      const submissionResponse = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          method: "POST",
          headers: {
            "X-RapidAPI-Key": "28f783f3dfmshbadde7ef66eb474p163aafjsnfc1c6dc36351",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "content-type": "application/json",
            "accept": "application/json",
          },
          body: JSON.stringify({
            source_code: input,
            stdin: userInput,
            language_id: languageId,
          }),
        }
      );

      const jsonResponse = await submissionResponse.json();
      let result = await pollSubmission(jsonResponse.token);
      
      setIsLoading(false);
      handleSubmissionResult(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  const pollSubmission = async (token) => {
    while (true) {
      const response = await fetch(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "28f783f3dfmshbadde7ef66eb474p163aafjsnfc1c6dc36351",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
      
      const result = await response.json();
      
      if (['Accepted', 'Rejected', 'Error'].includes(result.status.description)) {
        return result;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleSubmissionResult = (result) => {
    if (result.stdout) {
      const output = atob(result.stdout);
      setOutput(`${output}\nExecution Time: ${result.time} Secs\nMemory Used: ${result.memory} bytes`);
    } else if (result.stderr) {
      setOutput(`Error: ${atob(result.stderr)}`);
    } else if (result.compile_output) {
      setOutput(`Compilation Error: ${atob(result.compile_output)}`);
    }
  };

  return (
    <div className="compiler-container">
      <header>
        <h1>Compile.IO</h1>
      </header>
      <div className="compiler-grid">
        <div className="code-section">
          <div className="language-selector">
            <label>Language:</label>
            <select 
              value={languageId} 
              onChange={(e) => setLanguageId(e.target.value)}
            >
              <option value="54">C++</option>
              <option value="50">C</option>
              <option value="62">Java</option>
              <option value="71">Python</option>
            </select>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your code here..."
            className="code-input"
          />
          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="run-button"
          >
            {isLoading ? 'Running...' : 'Run Code'}
          </button>
        </div>
        <div className="io-section">
          <div className="input-container">
            <label>User Input:</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter input (optional)"
            />
          </div>
          <div className="output-container">
            <label>Output:</label>
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;