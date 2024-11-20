import axios from 'axios';

const JUDGE0_BASE_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;

const apiConfig = {
  headers: {
    "X-RapidAPI-Key": RAPID_API_KEY,
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    "content-type": "application/json",
    "accept": "application/json",
  }
};

export const createSubmission = async (sourceCode, languageId, stdin) => {
  try {
    const response = await axios.post(
      `${JUDGE0_BASE_URL}/submissions`, 
      { source_code: sourceCode, stdin, language_id: languageId },
      apiConfig
    );
    return response.data.token;
  } catch (error) {
    throw new Error('Submission creation failed');
  }
};

export const pollSubmission = async (token) => {
  const MAX_ATTEMPTS = 20;
  
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const response = await axios.get(
        `${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=true`,
        {
          headers: {
            "X-RapidAPI-Key": RAPID_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
      
      const result = response.data;
      const finalStatuses = ['Accepted', 'Rejected', 'Error'];
      
      if (finalStatuses.includes(result.status.description)) {
        return result;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      throw new Error('Submission polling failed');
    }
  }
  
  throw new Error('Submission polling timed out');
};

export const parseSubmissionResult = (result) => {
  if (result.stdout) {
    return {
      type: 'success',
      output: atob(result.stdout),
      executionTime: result.time,
      memoryUsed: result.memory
    };
  } 
  
  if (result.stderr) {
    return {
      type: 'error',
      message: `Runtime Error: ${atob(result.stderr)}`
    };
  } 
  
  if (result.compile_output) {
    return {
      type: 'compileError',
      message: `Compilation Error: ${atob(result.compile_output)}`
    };
  }
  
  return {
    type: 'unknown',
    message: 'Unknown execution error'
  };
};