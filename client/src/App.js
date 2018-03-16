import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from './web/Home.jsx'
import Main from './web/Main.jsx'

const App = () => (
  <Router>
    <div>

      <Route exact path="/" component={Home} />
      <Route path="/main" component={Main} />
    </div>
  </Router>
);

export default App;
