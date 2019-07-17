import React from 'react';
import ReactDOM from 'react-dom';
// import Bootstrap from 'bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {

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
            <Nav.Link href="./components/Profile">Profile</Nav.Link>
            <Nav.Link href="./components/Interests">Interests</Nav.Link>
            <Nav.Link href="./components/Pending">Pending</Nav.Link>
            <Nav.Link href="./components/Matches">Matches</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));