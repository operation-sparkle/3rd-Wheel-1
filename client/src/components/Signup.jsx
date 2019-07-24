import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';

import Login from './Login';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Signup = ({ gateKeeper, isLoggedIn, showAuthFail, toggleValue }) => {
  // hooks for input values
  const [ username, setUsername ] = useState('');
  const [ name, setName ] = useState('');
  const [ password, setPassword ] = useState('');

  // post user info to signup
  const usernameSubmit = (username, password) => {
    // dont allow re-render until complete!
    event.preventDefault();
    return axios.post('/signup', { username, password, name })
      .then(() => {
        // add data param and remove sensitive data to eliminate need to send get to users
        // console.log('signup', data);
        return gateKeeper();
      })
      .catch(err => {
        console.warn(err);
        showAuthFail();
      });
  };

  // sets state (w/ hooks) to match user input fields
  const handleChange = (event, func) => {
    func(event.target.value);
  };

  let buttonStyle = ""
  if (!toggleValue) {
    buttonStyle = "date-button";
  } else {
    buttonStyle = "friend-button";
  }
  return (
    isLoggedIn ?
      // if !!loggedIn === true, redirect to index (swapping to restricted view)
      <Route>
        <Route path="/" render={() => {
          <Redirect to="/login" />
        }} />
        <Route path="/signup" render={Login} />
      </Route>
      :
      // if !!loggedIn === false, redirect to index (swapping to restricted view)
      <Form>
        <Form.Group controlId="form-username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter Username"  onChange={(e) => handleChange(e, setUsername) } />
          <Form.Text className="text-muted">
            This username will not be viewed by other users.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="form-name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Name" onChange={(e) => handleChange(e, setName) } />
          <Form.Text className="text-muted">
            This is the name others will see.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="form-password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(e) => handleChange(e, setPassword) } />
        </Form.Group>
        {/* run on enter button too!!!! */}
        <Button className={buttonStyle} variant="primary" type="submit" onClick={() => usernameSubmit(username, password)}>
          Submit
        </Button>
      </Form>
  );  
}

export default Signup;