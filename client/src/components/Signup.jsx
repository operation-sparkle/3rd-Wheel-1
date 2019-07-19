import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Signup = ({}) => {
  const [ interestBool, allowInterest ] = useState(false);
  const [ username, setUsername ] = useState('');
  const [ name, setName ] = useState('');
  const [ password, setPassword ] = useState('');

  const usernameSubmit = (username, password) => {
    return axios.post('/signup', { username, password, name })
      .then((data) => {
        allowInterest(true);
        console.log('test', data);
      })
      // .then(() => axios.get('/interests'))
      // .then(() => 's' // make array of options for form)
      .catch(err => console.warn(err));
  };

  const handleChange = (event, func) => {
    func(event.target.value);
  };

  return (
    interestBool ? 
    <Form>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label> Tell us what you're interested in!! </Form.Label>
        <Form.Control as="select">
          {/* <option>1</option> */}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect2">
        <Form.Label>Example multiple select</Form.Label>
        <Form.Control as="select" multiple>
          {/* <option>1</option>*/}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Tell us what you're interested in!!</Form.Label>
        <Form.Control as="select">
          {/* <option>1</option> */}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect2">
        <Form.Label>Example multiple select</Form.Label>
        <Form.Control as="select" multiple>
          {/* <option>1</option> */}
        </Form.Control>
      </Form.Group><Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Tell us what you're interested in!!</Form.Label>
        <Form.Control as="select">
          {/* <option>1</option> */}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect2">
        <Form.Label>Example multiple select</Form.Label>
        <Form.Control as="select" multiple>
          {/* <option>1</option> */}
        </Form.Control>
      </Form.Group>
    </Form>
    :
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
      <Button variant="primary" type="submit" onClick={() => usernameSubmit(username, password)}>
       Submit
      </Button>
    </Form>
  );  
}

export default Signup;