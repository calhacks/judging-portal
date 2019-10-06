/*eslint-disable*/
import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      authenticated: false,
      authError: false
    };

    this.routeToOrganizer = this.routeToOrganizer.bind(this);
    this.routeToJudge = this.routeToJudge.bind(this);
  }

  async componentWillMount() {
    let res = await fetch('/api/authenticate');
    if (res.status === 200) this.setState({ authenticated: true });
  }

  routeToOrganizer() {
    const path = '/navigation';
    this.props.history.push(path);
  }

  routeToJudge() {
    const path = '/judge-login';
    this.props.history.push(path);
  }

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  authenticate = async () => {
    this.setState({ authError: false });
    let res = await fetch('/api/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: this.state.password
      })
    });

    if (res.status === 200) this.setState({ authenticated: true });
    else this.setState({ authError: true });
  };

  render() {
    return (
      <div className="home">
        <div className="home-container">
          <h1 className="home-title">Judging Portal</h1>
          {this.state.authenticated && (
            <div>
              <p className="home-header">I am:</p>
              <div className="route-buttons">
                <button className="h-button" onClick={this.routeToOrganizer}>
                  AN ORGANIZER
                </button>
                <button className="h-button" onClick={this.routeToJudge}>
                  A JUDGE
                </button>
              </div>
            </div>
          )}
          {!this.state.authenticated && (
            <div>
              <input
                style={
                  this.state.authError ? { background: 'palevioletred' } : {}
                }
                placeholder="Password"
                type="password"
                onChange={this.handlePasswordChange}
                onKeyDown={e => {
                  if (e.key === 'Enter') this.authenticate();
                }}
                className="data-entry-input"
                value={this.state.password}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Home;
