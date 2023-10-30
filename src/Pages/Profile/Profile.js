import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';
import firebase from 'firebase';
import { Loader } from '../../Components/Loader';
import { currentUserAction, isLoadingAction } from '../../Redux/Actions';
import './Profile.css';
import { useHistory } from 'react-router-dom';

export const Profile = (props) => {
  const state = useSelector((state) => state);
  const currentUser = state?.currentUser;
  const currentUserRole = currentUser && currentUser['role'];
  const loading = state?.isLoading;
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cvLink: '',
    github: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    profile: '', // New field for profile information
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const useruid = user?.uid;
        firebase.database().ref(`Users/${useruid}/`).on('value', (res) => {
          const userData = res.val();
          dispatch(currentUserAction(userData));

          // Update the formData state
          setFormData({
            fullName: userData?.fullName || '',
            email: userData?.email || '',
            cvLink: userData?.cvLink || '',
            github: userData?.github || '',
            instagram: userData?.instagram || '',
            linkedin: userData?.linkedin || '',
            twitter: userData?.twitter || '',
            profile: userData?.profile || '', // Load existing profile information
          });

          dispatch(isLoadingAction(false));
        });
      } else {
        dispatch(isLoadingAction(false));
        history.push('/');
      }
    });
    // eslint-disable-next-line
  }, [history]);

  const handleSave = () => {
    // Implement the logic to save the data to the database
    const useruid = firebase.auth().currentUser?.uid;

    // Fetch existing data to preserve other values
    firebase
      .database()
      .ref(`Users/${useruid}/`)
      .once('value')
      .then((snapshot) => {
        const existingData = snapshot.val();

        // Update the existing data with new values
        firebase.database().ref(`Users/${useruid}/`).update({
          ...existingData,
          cvLink: formData.cvLink,
          github: formData.github,
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          profile: formData.profile, // Save profile information
        });

        // Display an alert after saving
        alert('Data updated successfully!');
      });
  };
  
  return (
    <div className="ProfileMain">
      {/* Social Media Buttons */}
      <Row className="mb-3">
        <Col>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={() => {
              const link = prompt('Enter your GitHub link:', formData.github);
              setFormData({ ...formData, github: link });
            }}
          >
            GitHub
          </Button>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={() => {
              const link = prompt('Enter your Instagram link:', formData.instagram);
              setFormData({ ...formData, instagram: link });
            }}
          >
            Instagram
          </Button>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={() => {
              const link = prompt('Enter your LinkedIn link:', formData.linkedin);
              setFormData({ ...formData, linkedin: link });
            }}
          >
            LinkedIn
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const link = prompt('Enter your Twitter link:', formData.twitter);
              setFormData({ ...formData, twitter: link });
            }}
          >
            Twitter
          </Button>
        </Col>
      </Row>

      <Form onSubmit={(e) => e.preventDefault()} className="ProfileForm">
        {/* Name Section */}
        <Form.Group as={Row}>
          <Form.Label column sm={2} className="labels">
            Name
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" placeholder="Your Full Name" value={formData.fullName} disabled />
          </Col>
        </Form.Group>

        {/* Email Section */}
        <Form.Group as={Row}>
          <Form.Label column sm={2} className="labels">
            Email
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="email" placeholder="Your Email" value={formData.email} disabled />
          </Col>
        </Form.Group>

        {/* CV Link Section (Visible only for students) */}
        {currentUserRole === 'Student' && (
          <Form.Group as={Row}>
            <Form.Label column sm={2} className="labels">
              CV
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                id="cvLink"
                type="text"
                placeholder="Enter your CV link"
                value={formData.cvLink}
                onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
              />
            </Col>
          </Form.Group>
        )}

        {/* Profile Section */}
        <Form.Group as={Row}>
          <Form.Label column sm={2} className="labels">
            Profile
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write something about yourself..."
              value={formData.profile}
              onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
            />
          </Col>
        </Form.Group>

        {/* Save Button */}
        <Form.Group>
          <Button variant="primary" className="save-btn" type="button" onClick={handleSave}>
            Save
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};
