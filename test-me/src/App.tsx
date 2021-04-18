import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import MyTests from "./components/MyTests/MyTests";
import Navigation from './components/common/Navigation';
import CreateTest from './components/CreateTest/CreateTest';
import CompleteTest from './components/CompleteTest/CompleteTest';
import Authentication from "./components/Authentication/Authentication";
import { Redirect } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {window.location.pathname.includes("play") || window.location.pathname == "/auth" || window.location.pathname == "/" ? null : <Navigation renderNav={true} />}
        <Switch>
          <Redirect exact from="/create/done" to="/tests" />
          <Redirect exact from="/auth/done" to="/" />
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
