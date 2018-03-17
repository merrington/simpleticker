import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './web/Home.jsx'
import Main from './web/Main.jsx'
import Auth from './web/Auth.jsx'

const App = () => (
  <Router>
    <div>

      <Route exact path="/" component={Home} />
      <Route path="/main" component={Main} />
      <Route path="/auth-redirect" component={Auth} />
    </div>
  </Router>
);

export default App;
