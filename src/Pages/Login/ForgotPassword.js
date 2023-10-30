import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import firebase from 'firebase';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Function to handle sending a password reset email
  const handleSendPasswordResetEmail = () => {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        setEmailSent(true);
      })
      .catch(error => {
        console.error('Error sending password reset email:', error.message);
        // Handle error (display a message, etc.)
      });
  };

  return (
    <div className="forgotPasswordContainer">
      <h4>Forgot Password</h4>
      {emailSent ? (
        <p>An email has been sent to <span>{email}</span>. Follow the instructions in the email to reset your password.</p>
      ) : (
        <Form>
          <Form.Group controlId="formBasicEmail" className='formBasicEmail'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              We'll send you a link to reset your password.
            </Form.Text>
          </Form.Group>

          {/* Button to trigger sending the password reset email */}
          <Button variant="primary" type="button" onClick={handleSendPasswordResetEmail}>
            Send Email
          </Button>
        </Form>
      )}
    </div>
  );
};

export default ForgotPassword;
