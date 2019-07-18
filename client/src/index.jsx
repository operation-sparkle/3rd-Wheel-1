import React from 'react';
import ReactDOM from 'react-dom';
// import Bootstrap from 'bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


import Profile from './components/Profile';
import Interests from './components/Interests';
import Pending from './components/Pending';
import Matches from './components/Matches';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: "",
    }
    this.transition = this.transition.bind(this);
  }
  transition(linked) {
    return function() {
      ReactDOM.render(linked(), document.getElementById("body"));
    }
  }

  render() {
    return (
    <div className="App" >
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">3rd-Wheel</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={this.transition(Profile)}>Profile</Nav.Link>
            <Nav.Link onClick={this.transition(Interests)}>Interests</Nav.Link>
            <Nav.Link onClick={this.transition(Pending)}>Pending</Nav.Link>
            <Nav.Link onClick={this.transition(Matches)}>Matches</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"));