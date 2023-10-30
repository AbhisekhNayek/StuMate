import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import './CompanyList.css'; 

const ReadOnlyModal = ({ showModal, onHide, data }) => {
  return (
    <Modal show={showModal} onHide={onHide} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title>Company Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          {/* Display all properties from the company data */}
          {Object.keys(data).map((key) => (
            <Form.Group key={key}>
              <Form.Label className="labels" htmlFor={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)} {/* Capitalize the first letter of the key */}
              </Form.Label>
              <Form.Control id={key} type="text" value={data[key]} disabled={true} />
            </Form.Group>
          ))}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch companies data from Firebase or your database
    const fetchCompanies = async () => {
      try {
        const companiesSnapshot = await firebase.database().ref('Companies').once('value');
        const companiesData = companiesSnapshot.val();
        if (companiesData) {
          const companiesArray = Object.values(companiesData);
          setCompanies(companiesArray);
        }
      } catch (error) {
        console.error('Error fetching companies:', error.message);
      }
    };

    fetchCompanies();
  }, []);

  const removeCompany = (companyId) => {
    // Implement the logic to remove a company from the database
    firebase.database().ref(`Companies/${companyId}`).remove();
    // Update the state to reflect the removal
    setCompanies((prevCompanies) => prevCompanies.filter((company) => company.uid !== companyId));
  };

  const handleViewProfile = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  return (
    <div>
      <h2>Company List</h2>
      <ul>
        {companies.map((company) => (
          <li key={company.uid} className="company-container">
            <div className="company-details">
              <p>{company.companyName}</p>
              <div className="buttons-container">
                <Button onClick={() => handleViewProfile(company)}>View Details</Button>{' '}
                <Button onClick={() => removeCompany(company.uid)}>Remove Company</Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Display the ReadOnlyModal if a company is selected */}
      {selectedCompany && (
        <ReadOnlyModal showModal={showModal} onHide={() => setShowModal(false)} data={selectedCompany} />
      )}
    </div>
  );
};

export default CompanyList;