import React from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom'
import axios from 'axios';
// import getLocation from '../helpers/index';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Profile from './components/Profile';
import HotSpots from './components/HotSpots';
import Pending from './components/Pending';
import Matches from './components/Matches';
import Signup from './components/Signup';
import Login from './components/Login';
import Interests from './components/Interests';


class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      user: {},
      isLoggedIn: false,
      failedLogin: false,
    }
    
    this.showAuthFail = this.showAuthFail.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.gateKeeper = this.gateKeeper.bind(this);
    this.openGate = this.openGate.bind(this);
    // attempt to get user data initially.
    // if no cookie, middleware redirects.
    
    this.gateKeeper();
  }

  // function to flip bool and get user info when signup succeeds
  gateKeeper() {
    return this.getUserInfo()
    .then(response => {
      // console.log('test', response);
      if (typeof response.data === 'object'){
        
        const successCallback = (position) => {
          // By using the 'maximumAge' option above, the position
          // object is guaranteed to be at most 10 minutes old.
          // could send timestamp too!
          const { longitude, latitude } = position.coords;
          axios.patch('/users', { longitude, latitude })
            .then(this.openGate)              
            .catch(err => console.warn(err));
        }
        
        const errorCallback = () => {
          // Update a div element with error.message.
          this.showAuthFail();
        }

        return navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { maximumAge: 600000 })
      }
    })
    .catch(err => { 
      console.warn(err);
      this.showAuthFail();
    });
  }
  
  getUserInfo() {
    // no auto login happening. send get to login instead?
    return axios.get('/users/');
  }

  showAuthFail() {
    this.setState({
      failedLogin: true,
    })
  }

  openGate(response) {
    this.setState({
      isLoggedIn: !this.state.isLoggedIn,
      user: response.data,
    })
  }

  render() {
    const { isLoggedIn, failedLogin, user } = this.state;

    return (
      <div className="App" >
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">3rd-Wheel</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
        { 
          isLoggedIn ? 
          // logged in nav
          <Nav className="top-bar">
            <NavDropdown title="Your Card" id="basic-nav-dropdown">
              <Link className="dropdown-item" to="/profile" >Profile</Link>
              <Link className="dropdown-item" to="/interests" >Interests</Link>
            </NavDropdown>
            <Link className="nav-link" to="/hotspots" >Hot Spots</Link>
            <Link className="nav-link" to="/matches" >Matches</Link>
            <Link className="nav-link" to="/pending" >Pending</Link>
            {/*  // Make this sign out user and relocate them to sign in
              <Link className="nav-link" to="/signin" >Sign out</Link> */}
          </Nav>
          : 
          // not logged in nav
          <Nav className="top-bar">
            <Link className="nav-link" to="/signup" >Sign up</Link>
            <Link className="nav-link" to="/login" >Log in</Link>
          </Nav>
        }
          </Navbar.Collapse>
        </Navbar>
        { 
          isLoggedIn ? 
          // !loggedIn routes
            <Switch>
              <Route exact path="/" components={() => {
                <Redirect to="/profile" />
              }} />
              <Route path="/matches" render={(props) => <Matches {...props} user={user} />}  />
              <Route path="/interests" render={(props) => <Interests {...props} user={user} />} />
              <Route path="/hotspots" render={(props) => <HotSpots {...props} user={user} />} />
              <Route path="/pending" render={(props) => <Pending {...props} user={user} />} />
              <Route path="/profile" render={(props) => <Profile {...props} user={user} />} />
            </Switch>
          :
          // !loggedIn routes
            <Switch>
              <Route exact path="/" render={() => (
                <Redirect to="/login"/>
              )} />
              <Route path="/signup" render={(props) => <Signup {...props} showAuthFail={this.showAuthFail} gateKeeper={this.gateKeeper} isLoggedIn={isLoggedIn} />} />
              <Route path="/login" render={(props) => <Login {...props} showAuthFail={this.showAuthFail} gateKeeper={this.gateKeeper} isLoggedIn={isLoggedIn} />} />
            </Switch>
        }
        { failedLogin ? <p>Please try again</p> : <div/> }
      </div>
    )
  }
}

export default App;