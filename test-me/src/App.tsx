import React from 'react';
import logo from './logo.svg';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Navigation from './components/common/Navigation';
import MyTests from "./components/MyTests/MyTests";
import Authentication from "./components/Authentication/Authentication";
import CreateTest from './components/CreateTest/CreateTest';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Switch>
          <Route path="/auth" component={Authentication} />
          <Route path="/tests" component={MyTests} />
          <Route path="/create" component={CreateTest} />
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
