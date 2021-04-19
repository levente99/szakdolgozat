import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import MyTests from "./components/MyTests/MyTests";
import CreateTest from './components/CreateTest/CreateTest';
import Results from './components/CompleteTest/Results/Results';
import CompleteTest from './components/CompleteTest/CompleteTest';
import Authentication from "./components/Authentication/Authentication";
import { Redirect } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Redirect exact from="/create/done" to="/tests" />
          <Redirect exact from="/auth/done" to="/" />
          <Route path="/auth" component={Authentication} />
          <Route path="/tests" component={MyTests} />
          <Route path="/create" component={CreateTest} />
          <Route path="/play" component={CompleteTest} />
          <Route path="/results" component={Results} />
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
