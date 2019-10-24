import React, { Component } from 'react';
import '../OrganizerPortal.css';
import { Link } from 'react-router-dom';
import Home from '../../../assets/home.svg';
import APICategory from './APICategory';

class ProjectBreakdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectsJson: {},
      keys: null,
      buttons: []
    };
    this.routeToPrev = this.routeToPrev.bind(this);
    this.routeToNext = this.routeToNext.bind(this);
    this.flipButtonUp = this.flipButtonUp.bind(this);
    this.flipButtonDown = this.flipButtonDown.bind(this);
  }

  async componentDidMount() {
    const projectsJson = {};
    const keys = [];
    const dButtons = [];
    const categories = await this.getCategories();
    for (let i = 0; i < categories.length; i += 1) {
      const category = categories[i].category;
      projectsJson[category] = {
        scored: [],
        unscored: []
      };
      keys.push(category);
      dButtons.push(
        <button type="button" className="dropdown-button-proj">
          <div className="dropdown-button-shape-down"></div>{' '}
        </button>
      );
    }

    let proms = [];

    const projects = await this.getProjects();
    for (let j = 0; j < projects.length; j += 1) {
      proms.push(
        new Promise(async (res, rej) => {
          const projectid = projects[j].projectid;
          const scores = await this.getScores(projectid);

          let innerProms = [];
          for (let k = 0; k < scores.length; k += 1) {
            innerProms.push(
              new Promise(async (res, rej) => {
                const judgeid = scores[k].judgeid;
                const projectName = projects[j].name;
                const category = scores[k].category;
                const judge = await this.getJudge(judgeid);
                const judgeName = judge[0].name;
                if (projectsJson[category]) {
                  if (scores[k].score) {
                    projectsJson[category].scored.push([
                      projectName,
                      judgeName,
                      scores[k].score
                    ]);
                  } else {
                    projectsJson[category].unscored.push([
                      projectName,
                      judgeName
                    ]);
                  }
                }
                res();
              })
            );
          }
          await Promise.all(innerProms)
          res();
        })
      );
    }
    await Promise.all(proms);

    this.setState({
      projectsJson: projectsJson,
      keys: keys,
      buttons: dButtons
    });
  }

  async getJudge(judgeid) {
    const res = await fetch('/api/judgename/' + judgeid, {
      credentials: 'include'
    });
    const resJson = res.json();
    return resJson;
  }

  async getCategories() {
    const res = await fetch('/api/categories', { credentials: 'include' });
    const resJson = res.json();
    return resJson;
  }

  async getScores(projectID) {
    const res = await fetch('/api/projectscore/' + projectID, {
      credentials: 'include'
    });
    const resJson = res.json();
    return resJson;
  }

  async getName(projectID) {
    const res = await fetch('/api/projectname/' + projectID, {
      credentials: 'include'
    });
    const resJson = res.json();
    return resJson;
  }

  async getProjects() {
    const res = await fetch('/api/projects', { credentials: 'include' });
    const resJson = res.json();
    return resJson;
  }

  async getAPIs() {
    const res = await fetch('/api/apis', { credentials: 'include' });
    const resJson = res.json();
    return resJson;
  }

  async flipButtonUp(i) {
    await this.setState(prevState => {
      const newButtons = prevState.buttons;
      newButtons[i] = (
        <button type="button" className="dropdown-button-proj">
          <div className="dropdown-button-shape-up"></div>{' '}
        </button>
      );
      return {
        buttons: newButtons
      };
    });
  }

  async flipButtonDown(i) {
    await this.setState(prevState => {
      const newButtons = prevState.buttons;
      newButtons[i] = (
        <button type="button" className="dropdown-button-proj">
          <div className="dropdown-button-shape-down"></div>{' '}
        </button>
      );
      return {
        buttons: newButtons
      };
    });
  }

  routeToPrev() {
    const path = '/hacker-spreadsheet';
    this.props.history.push(path);
  }

  routeToNext() {
    const path = '/winners';
    this.props.history.push(path);
  }

  render() {
    const projects = this.state.projectsJson;
    const keys = this.state.keys;
    if (this.state.keys === null) {
      return (
        <div className="page-background" id="projBreakdown">
          <div className="page-header">
            <div className="home-nav">
              <img className="home-icon" src={Home} alt="home icon" />
              <Link className="home-label" to="/navigation">
                HOME
              </Link>
            </div>
            SCORING BREAKDOWN
          </div>
          <div className="content-background">
            <div className="loading-page">
              <h1 className="loading-text">Loading...</h1>
            </div>

            <div className="links">
              <Link
                className="nav prev"
                to="/judge-info"
                onClick={this.routeToPrev}
              >
                &#60; JUDGE INFO
              </Link>
              <Link
                className="nav next"
                to="/hacker-spreadsheet"
                onClick={this.routeToNext}
              >
                HACKER SPREADSHEET >
              </Link>
            </div>
          </div>
        </div>
      );
    }
    const apiCategories = [];
    for (let i = 0; i < this.state.keys.length; i += 1) {
      apiCategories.push(
        <APICategory
          key={keys[i]}
          button={this.state.buttons[i]}
          index={i}
          flipButtonUp={this.flipButtonUp}
          flipButtonDown={this.flipButtonDown}
          api={keys[i]}
          alldata={projects[keys[i]]}
        />
      );
    }
    return (
      <div className="page-background" id="projBreakdown">
        <div className="page-header">SCORING BREAKDOWN</div>
        <div className="content-background">
          <div className="api-category-box">{apiCategories}</div>
          <div className="links">
            <Link
              className="nav prev"
              to="/judge-info"
              onClick={this.routeToPrev}
            >
              &#60; JUDGE INFO
            </Link>
            <Link className="nav next" to="/hacker-spreadsheet" onClick={this.routeToNext}>
              HACKER SPREADSHEET >
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectBreakdown;
