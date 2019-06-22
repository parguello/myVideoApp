import React from "react";
import "./App.css";
import { VideoList } from "./components/VideoList";
import { AddVideo } from "./components/AddVideo";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  return (
    <Router>
      <div className="App">
        {/*} <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
  </header>*/}
        <header id="header">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="navbar-brand">
              <FontAwesomeIcon icon={faPlayCircle} /> My Video List App
            </div>
          </nav>
        </header>
        <div id="main" className="layout-main">
          <Route path="/" exact component={VideoList} />
          <Route path="/addVideo" exact component={AddVideo} />
        </div>
        <footer id="footer">
          <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-right">
            <p>
              Designed and coded with <FontAwesomeIcon icon={faHeart} />
              <span> </span> by Patricia Arguello.{" "}
            </p>
          </nav>
        </footer>
      </div>
    </Router>
  );
}

export default App;
