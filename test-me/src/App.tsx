import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import MyTests from "./components/MyTests/MyTests";
import Navigation from './components/common/Navigation';
import CreateTest from './components/CreateTest/CreateTest';
import CompleteTest from './components/CompleteTest/CompleteTest';
import Authentication from "./components/Authentication/Authentication";
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
          <Route path="/play" component={CompleteTest} />
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
