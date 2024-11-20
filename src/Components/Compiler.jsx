import React, { useState, useEffect } from 'react';
import { createSubmission, pollSubmission, parseSubmissionResult } from '../api/api';
import '../Compiler.css';

const Compiler = () => {
  const [input, setInput] = useState(localStorage.getItem('input') || '');
  const [output, setOutput] = useState('');
  const [languageId, setLanguageId] = useState(localStorage.getItem('language_Id') || '71');
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('input', input);
    localStorage.setItem('language_Id', languageId);
    localStorage.setItem('theme', theme);
    document.body.className = theme + '-theme';
  }, [input, languageId, theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOutput('Creating Submission...\n');

    try {
      const token = await createSubmission(input, languageId, userInput);
      // console.log(input, languageId, userInput);
      
      const result = await pollSubmission(token);
      const submissionResult = parseSubmissionResult(result);

      switch(submissionResult.type) {
        case 'success':
          setOutput(`${submissionResult.output}\nExecution Time: ${submissionResult.executionTime} Secs\nMemory Used: ${submissionResult.memoryUsed} bytes`);
          break;
        case 'error':
        case 'compileError':
          setOutput(submissionResult.message);
          break;
        default:
          setOutput('Unexpected execution result');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <div className={`compiler-container ${theme}-theme`}>
      <header>
        <h1>Compile.IO</h1>
        <div className="theme-toggle-container">
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
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