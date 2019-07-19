import React from 'react';
import { Route, Switch, Link } from 'react-router-dom'

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
      isLoggedIn: false,
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
        { isLoggedIn ? 
          <Nav className="top-bar">
              <Link className="nav-link" to="/profile" >Profile</Link>
              <Link className="nav-link" to="/interest" >Interests</Link>
              <Link className="nav-link" to="/pending" >Pending</Link>
              <Link className="nav-link" to="/matches" >Matches</Link>
              <Link className="nav-link" to="/signout" >Sign out</Link>

          </Nav>
          : 
            <Nav className="top-bar">
                <Link className="nav-link" to="/Signup" >Sign up</Link>
                <Link className="nav-link" to="/login" >Log in</Link>
            </Nav>
        }
          </Navbar.Collapse>
        </Navbar>
      { isLoggedIn ? 
        <Switch>
          <Route path="/profile" component={Profile} />
          <Route path="/interest" component={Intersets} />
          <Route path="/pending" component={Pending} />
          <Route path="/matches" component={Matches} />
        </Switch>
      :
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </Switch>
      }
      </div>
    )
  }
}

export default App;