import React, { useState } from 'react';
import { Redirect } from 'react-router-dom'
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = ({ gateKeeper, isLoggedIn, showAuthFail, failedLogin }) => {
  // hooks for input values
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  // post user info to signup
  const loginUser = (username, password) => {
    // dont allow re-render until complete!
    event.preventDefault();
    return axios.post('/login', { username, password })
      .then(() => {
        // add data param and remove sensitive data to eliminate need to send get to users
        // console.log('login', data);
        gateKeeper();
      })
      .catch(err =>{
        console.warn(err);
        showAuthFail();
      });
  };

  // sets state (w/ hooks) to match user input fields
  const handleChange = (event, func) => {
    func(event.target.value);
  };

  return (
    isLoggedIn ?
      // if !!loggedIn === true, redirect to index (swapping to restricted view)
      <Switch>
        <Route path="/login" render={() => {
          <Redirect to="/" />
        }} />
      </Switch>
      :
      <Form>
        <Form.Group controlId="form-username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter Username"  onChange={(e) => handleChange(e, setUsername) } />
          <Form.Text className="text-muted">
            Username
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="form-password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(e) => handleChange(e, setPassword) } />
          <Form.Text className="text-muted">
            Password
          </Form.Text>
        </Form.Group>
        {/* run on enter button too!!!! */}
        <Button variant="primary" type="submit" onClick={() => loginUser(username, password)}>
          Login
        </Button>
        { failedLogin ? <p>Please try again</p> : <div/> }
      </Form>   
  );  
}

export default Login; 