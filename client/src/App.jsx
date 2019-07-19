import React from 'react';
import { Route, Switch, Link } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Profile from './components/Profile';
import Interests from './components/Interests';
import Pending from './components/Pending';
import Matches from './components/Matches';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Axios from 'axios';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: "",
      isLoggedIn: true,
    }
    this.transition = this.transition.bind(this);
  }
  backHome() {
    Axios.get('/', {

    })
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
        { isLoggedIn ? 
          <Nav className="top-bar">
              <Link className="nav-link" to="/Profile" >Profile</Link>
              <Link className="nav-link" to="/Interest" >Interests</Link>
              <Link className="nav-link" to="/Pending" >Pending</Link>
              <Link className="nav-link" to="/Matches" >Matches</Link>
          </Nav>
          : 
            <Nav className="top-bar">
                <Link className="nav-link" to="/Signup" >Signup</Link>
                <Link className="nav-link" to="/Signin" >Signin</Link>
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
          <Route path="/Signin" component={Signin} />
        </Switch>
      }
      </div>
    )
  }
}

export default App;