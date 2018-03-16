import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from './web/Home.jsx'

const App = () => (
  <Router>
    <div>

      <Route exact path="/" component={Home} />
      <Route path="/auth-redirect" component={About} />
    </div>
  </Router>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

export default App;
