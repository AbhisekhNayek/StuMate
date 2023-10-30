// Importing necessary dependencies
import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import './StudentList.css';

// Component for a read-only modal displaying student details
const ReadOnlyModal = ({ showModal, onHide, data }) => {
  return (
    // Modal component from react-bootstrap with student details
    <Modal show={showModal} onHide={onHide} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Student Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          {/* Displaying student details in form controls */}
          <Form.Group>
            <Form.Label className="labels" htmlFor="fullName">
              Name
            </Form.Label>
            <Form.Control id="fullName" type="text" value={data.fullName} disabled={true} />
          </Form.Group>

          <Form.Group>
            <Form.Label className="labels" htmlFor="email">
              Email
            </Form.Label>
            <Form.Control id="email" type="text" value={data.email} disabled={true} />
          </Form.Group>

          <Form.Group>
            <Form.Label className="labels" htmlFor="cvLink">
              CV Link
            </Form.Label>
            <Form.Control id="cvLink" type="text" value={data.cvLink || 'No Data'} disabled={true} />
          </Form.Group>

          <Form.Group>
            <Form.Label className="labels" htmlFor="profile">
              Profile
            </Form.Label>
            <Form.Control id="profile" as="textarea" rows={3} value={data.profile || 'No Data'} disabled={true} />
          </Form.Group>

          {/* Buttons to open external links in a new tab */}
          <Button variant="secondary" onClick={() => window.open(data.github, '_blank')}>
            GitHub
          </Button>
          <Button variant="secondary" onClick={() => window.open(data.linkedin, '_blank')}>
            LinkedIn
          </Button>
          <Button variant="secondary" onClick={() => window.open(data.instagram, '_blank')}>
            Instagram
          </Button>
          <Button variant="secondary" onClick={() => window.open(data.twitter, '_blank')}>
            Twitter
          </Button>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {/* Button to close the modal */}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Component to display a list of students with options to view profiles and remove them
const StudentList = () => {
  // State to store the list of students, the selected student, and modal visibility
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetching students data from Firebase on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      const studentsSnapshot = await firebase.database().ref('Students').once('value');
      const studentsData = studentsSnapshot.val();
      if (studentsData) {
        // Mapping student data to an array and updating state
        const studentsArray = Object.values(studentsData);
        setStudents(studentsArray);
      }
    };

    fetchStudents();
  }, []);

  // Function to remove a student from the database and update the state
  const removeStudent = (studentUid) => {
    console.log("Removing student with UID:", studentUid);

    firebase
      .database()
      .ref(`Students/${studentUid}`)
      .remove()
      .then(() => {
        console.log("Student removed successfully.");
        setStudents((prevStudents) => prevStudents.filter((student) => student.uid !== studentUid));
      })
      .catch((error) => {
        console.error("Error removing student:", error.message);
      });
  };

  // Function to handle viewing a student's profile
  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  // Rendering the StudentList component
  return (
    <div>
      <h2>Student List</h2>
      {/* Displaying a list of students with options to view profiles and remove them */}
      <ul>
        {students.map((student) => (
          <li key={student.uid} className="student-container">
            <div className="student-details">
              <p>{student.fullName}</p>
              {/* Buttons to view profile and remove student */}
              <div className="buttons-container">
                <Button onClick={() => handleViewProfile(student)}>View Profile</Button>
                <Button onClick={() => removeStudent(student.uid)}>Remove Student</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Displaying the ReadOnlyModal if a student is selected */}
      {selectedStudent && (
        <ReadOnlyModal showModal={showModal} onHide={() => setShowModal(false)} data={selectedStudent} />
      )}
    </div>
  );
};

// Exporting the StudentList component
export default StudentList;
