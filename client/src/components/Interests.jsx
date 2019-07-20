import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

const UserInfo = () => {
  return (
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
  );  
}

export default UserInfo; 