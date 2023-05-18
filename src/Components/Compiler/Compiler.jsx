import React, { Component } from "react";
import "./Compiler.css";
import logo from "./logo.png";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../Blog/firebase-config";

export default class Compiler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: localStorage.getItem("input") || ``,
      output: ``,
      language_id: localStorage.getItem("language_Id") || 2,
      user_input: ``,
    };
  }

  input = (event) => {
    event.preventDefault();
    this.setState({ input: event.target.value });
    localStorage.setItem("input", event.target.value);
  };

  userInput = (event) => {
    event.preventDefault();
    this.setState({ user_input: event.target.value });
  };

  language = (event) => {
    event.preventDefault();
    this.setState({ language_id: event.target.value });
    localStorage.setItem("language_Id", event.target.value);
  };

  submit = async (e) => {
    e.preventDefault();
    let outputText = document.getElementById("output");
    outputText.innerHTML = "";
    outputText.innerHTML += "Creating Submission ...\n";
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "X-RapidAPI-Key":
            "28f783f3dfmshbadde7ef66eb474p163aafjsnfc1c6dc36351",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: this.state.input,
          stdin: this.state.user_input,
          language_id: this.state.language_id,
        }),
      }
    );

    outputText.innerHTML += "Submission Created ...\n";
    const jsonResponse = await response.json();
    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };
    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "28f783f3dfmshbadde7ef66eb474p163aafjsnfc1c6dc36351",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "content-type": "application/json",
          },
        });
        jsonGetSolution = await getSolution.json();
      }
    }

    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);
      outputText.innerHTML = "";
      outputText.innerHTML += `${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${error}`;
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${compilation_error}`;
    }
  };

  render() {

    return (
      <>
        <header className="nav">
          <img src={logo} alt="logo" width={80} height={80} />
          <h3>Compile.IO</h3>
          {/* <Router>
            <Link to="/blog">Blogs</Link>
            <Link to="/blog/login">Login</Link>

            <Routes>
              <Route
                exact
                path="/blog"
                element={<Home isAuth={this.state.isAuth} />}
              />
              <Route
                exact
                path="/blog/login"
                element={<Login setIsAuth={this.setState.setIsAuth} />}
              />
            </Routes>
          </Router> */}
        </header>
        <div className="row container-fluid">
          <div className="col-6 ml-3 my-4 ">
            <label htmlFor="tags" className="mr-1">
              <b className="heading">Language:</b>
            </label>
            <select
              value={this.state.language_id}
              onChange={this.language}
              id="tags"
              className="form-control form-inline mb-3 language"
            >
              <option value="54">🔥C++</option>
              <option value="50">⚙️C</option>
              <option value="62">💝Java</option>
              <option value="71">🐍Python</option>
            </select>
            <label htmlFor="solution ">
              <span className="badge badge-info heading mt-2 ">
                <i className="fas fa-code fa-fw fa-lg "></i> Code Here
              </span>
            </label>
            <textarea
              required
              name="solution"
              id="source"
              onChange={this.input}
              className=" source"
              value={this.state.input}
            ></textarea>

            <button
              type="submit"
              className="btn btn-danger ml-2 mr-2 cusbtn"
              onClick={this.submit}
            >
              <i className="fas fa-cog fa-fw"></i>Run👨‍💻
            </button>
          </div>

          <div className="col-1">
            <div className="mt-3 ml-7">
              <span className="badge badge-primary heading my-2 ">
                <i className="fas fa-user fa-fw fa-md"></i> User Input
              </span>
              <br />
              <textarea id="input" onChange={this.userInput}></textarea>
            </div>

            <div>
              <span className="badge badge-info heading my-2">
                <i className="fas fa-exclamation fa-fw fa-md icon"></i> Output
              </span>
              <textarea id="output" readOnly></textarea>
            </div>
          </div>
        </div>
      </>
    );

    // return (
    //   <>
    //     <div className="row container-fluid">
    //       <div className="col-6 ml-4 ">
    //         <label htmlFor="solution ">
    //           <span className="badge badge-info heading mt-2 ">
    //             <i className="fas fa-code fa-fw fa-lg "></i> Code Here
    //           </span>
    //         </label>
    //         <textarea
    //           required
    //           name="solution"
    //           id="source"
    //           onChange={this.input}
    //           className=" source"
    //           value={this.state.input}
    //         ></textarea>
    //       </div>
    //     </div>
    //     <Button colorScheme="red" size="xs" onClick={this.submit}>
    //       Submit
    //     </Button>
    //   </>
    // );
  }
}

function BlogApp() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/blog/login";
    });
  };
}
