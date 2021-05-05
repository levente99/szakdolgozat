import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import MyTests from "./components/MyTests/MyTests";
import CreateTest from './components/CreateTest/CreateTest';
import Results from './components/CompleteTest/Results/Results';
import CompleteTest from './components/CompleteTest/CompleteTest';
import Authentication from "./components/Authentication/Authentication";

import './App.css';

function App() {
  let history = useHistory();

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/auth">
            <Authentication History={history} />
          </Route>
          <Route path="/create">
            <CreateTest History={history} />
          </Route>
          <Route path="/tests" component={MyTests} />
          <Route path="/play" component={CompleteTest} />
          <Route path="/results" component={Results} />
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
