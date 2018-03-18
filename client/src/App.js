import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './web/Home.jsx'
import Auth from './web/Auth.jsx'
import './App.css';

const App = () => (
    <Router>
      <div>
        <div class="container-fluid container-yellow">
          <div class="container-padded">
            <br/>
            <div class="text-center">
              <div class="scroll-left">
                <h1 class="h1-serif">Simpleticker</h1>
              </div>
            </div>
            <br/>
          </div>
        </div>
      <div class="container-padded">
        <div class="text-center base-margin">
            <Route exact path="/" component={Home} />
            <Route path="/auth-redirect" component={Auth} />
        </div>
      </div>
      </div>
    </Router>
);

export default App;
