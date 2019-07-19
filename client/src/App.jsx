import React from 'react';
import { Route, Switch, Link, Redirect } from 'react-router-dom'
import Axios from 'axios';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Profile from './components/Profile';
import Interests from './components/Interests';
import Pending from './components/Pending';
import Matches from './components/Matches';
import Signup from './components/Signup';
import Login from './components/Login';


class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: "",
      isLoggedIn: true,
    }
    this.transition = this.transition.bind(this);
  }

  transition(linked) {
    return function() {
      ReactDOM.render(linked(), document.getElementById("body"));
    }
  }

  render() {
    const { isLoggedIn } = this.state;
    return (
      <div className="App" >
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">3rd-Wheel</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
        { 
          isLoggedIn ? 
          <Nav className="top-bar">
              <Link className="nav-link" to="/profile" >Profile</Link>
              <Link className="nav-link" to="/interest" >Interests</Link>
              <Link className="nav-link" to="/pending" >Pending</Link>
              <Link className="nav-link" to="/matches" >Matches</Link>
            {/*  // Make this sign out user and relocate them to sign in
              <Link className="nav-link" to="/signin" >Sign out</Link> */}
          </Nav>
          
          : 
            <Nav className="top-bar">
                <Link className="nav-link" to="/signup" >Sign up</Link>
                <Link className="nav-link" to="/login" >Log in</Link>
            </Nav>
        }
          </Navbar.Collapse>
        </Navbar>
      { isLoggedIn ? 
        <Switch>
          <Route path="/Profile" component={Profile} />
          <Route path="/Interests" component={Interests} />
          <Route path="/Pending" component={Pending} />
          <Route path="/Matches" component={Matches} />
        </Switch>
      :
        <Switch>
          <Route path="/Signup" component={Signup} />
          <Route path="/Login" component={Login} />
        </Switch>
      }
      </div>
    )
  }
}

export default App;