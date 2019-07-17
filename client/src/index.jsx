import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap';
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
        {/* <h1>3rd Wheel</h1> */}
        <Navbar fixed="top" expand="true" bg="dark" variant="dark">
          {/* Link brand to hot dates */}
          <Navbar.Brand>3rd Wheel</Navbar.Brand>
          <Navbar.toggle> </Navbar.toggle>
          <Nav.link> Profile </Nav.link>
        </Navbar>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));