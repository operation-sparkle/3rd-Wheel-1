import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

const Signup = ({}) => {
  const [ createBool, allowCreate ] = useState(false);




  const usernameSubmit = (username, password) => {
    return axios.post('/signup', { username, password })
    .then((obj) => {
      if (obj.data) {
        // flip val of canCreate
        allowCreate(true);
      }
    })
    .then(() => axios.get('/interests'))
    // .then(() => '' // make array of options for form)
    // .catch(err => );
  };

  return (
    createBool ? 
    <Form>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Tell us what you're interested in!!</Form.Label>
        <Form.Control as="select">
          {/* { 
          <option>1</option>
          } */}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect2">
        <Form.Label>Example multiple select</Form.Label>
        <Form.Control as="select" multiple>
          {/* <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option> */}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Tell us what you're interested in!!</Form.Label>
        <Form.Control as="select">
          {/* { 
          <option>1</option>
          } */}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect2">
        <Form.Label>Example multiple select</Form.Label>
        <Form.Control as="select" multiple>
          {/* <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option> */}
        </Form.Control>
      </Form.Group><Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Tell us what you're interested in!!</Form.Label>
        <Form.Control as="select">
          {/* { 
          <option>1</option>
          } */}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect2">
        <Form.Label>Example multiple select</Form.Label>
        <Form.Control as="select" multiple>
          {/* <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option> */}
        </Form.Control>
      </Form.Group>
    </Form>
    :
    <Form>
      <Form.Group controlId="form-username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" />
        <Form.Text className="text-muted">
          This username will not be viewed by other users.
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <button variant="primary" type="submit" onClick={usernameSubmit} >
        Submit
      </button>
    </Form>
  );  
}

export default Signup;