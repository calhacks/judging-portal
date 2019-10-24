/* eslint-disable */
import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Navigation from './components/Organizer/Navigation/Navigation';
import DataEntry from './components/Organizer/DataEntry/DataEntry';
import JudgeInfo from './components/Organizer/JudgeInfo/JudgeInfo';
import ProjectBreakdown from './components/Organizer/ProjectBreakdown/ProjectBreakdown';
import JudgeLogin from './components/Judge/JudgeLogin/JudgeLogin';
import Instructions from './components/Judge/Instructions/Instructions';
import ScoringOverview from './components/Judge/ScoringOverview/ScoringOverview';
import ProjectInfo from './components/Judge/ProjectInfo/ProjectInfo';
import Spreadsheet from './components/Organizer/HackerSpreadsheet/Spreadsheet';
import Winners from './components/Organizer/Winners/WinnerPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/navigation" component={Navigation} />
            <Route exact path="/data-entry" component={DataEntry} />
            <Route exact path="/judge-info" component={JudgeInfo} />
            <Route exact path="/overview" component={ScoringOverview} />
            <Route exact path="/instructions" component={Instructions} />
            <Route exact path="/judge-login" component={JudgeLogin} />
            <Route exact path="/project-info" component={ProjectInfo} />
            <Route exact path="/project-breakdown" component={ProjectBreakdown} />
            <Route exact path="/hacker-spreadsheet" component={Spreadsheet} />
            <Route exact path="/winners" component={Winners} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
