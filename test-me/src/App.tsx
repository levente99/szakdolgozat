import React from 'react';
import logo from './logo.svg';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Navigation from './components/common/Navigation';
import MyTests from "./components/MyTests/MyTests";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/tests" component={MyTests} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
