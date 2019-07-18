import React from 'react';
import ReactDOM from 'react-dom';
// import Bootstrap from 'bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


import Profile from './components/Profile';
import Interests from './components/Interests';
import Pending from './components/Pending';
import Matches from './components/Matches';
import Signup from './components/Signup';
import Signin from './components/Signin';

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
                <Nav.Link onClick={this.transition(Profile)}>Profile</Nav.Link>
                <Nav.Link onClick={this.transition(Interests)}>Interests</Nav.Link>
                <Nav.Link onClick={this.transition(Pending)}>Pending</Nav.Link>
                <Nav.Link onClick={this.transition(Matches)}>Matches</Nav.Link>
            </Nav>
            : 
            <Nav className="top-bar">
                <Nav.Link onClick={this.transition(Signup)}>Signup</Nav.Link>
                <Nav.Link onClick={this.transition(Signin)}>Signin</Nav.Link>
            </Nav>
          }
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"));