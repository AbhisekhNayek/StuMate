// Importing necessary dependencies
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Cards } from '../../../Components/Card/Cards'; // Importing the Cards component
import { ReadOnlyModal } from '../../../Components/Modal/ReadOnlyModal'; // Importing the ReadOnlyModal component
import firebase from 'firebase';
import './Vacancies.css';
import { useHistory } from 'react-router';

// Functional component to display job vacancies for a company
export const Vacancies = () => {
  // Redux state to get current user details and job information
  const state = useSelector((state) => state);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [appliedStudent, setAppliedStudent] = useState(); // State to store information of applied student
  const currentUser = state?.currentUser; // Current logged-in user
  const allJobs = state?.allJobs; // All job vacancies
  const currentUserUid = currentUser?.uid; // UID of the current user
  const allUsers = state?.allUsers; // All users in the application
  const history = useHistory();

  // Redirect the user to the home page if not a company
  useEffect(() => {
    if (currentUser?.role !== 'Company') {
      history.push('/');
    }
  }, [history, currentUser?.role]);

  // Function to delete a job vacancy
  const deleteJob = (e) => {
    let jobUUID = e?.jobUUID;
    firebase.database().ref(`Jobs/${jobUUID}`).remove();
  };

  // Function to handle displaying applied students in a modal
  const studentsDropDown = (e) => {
    Object.entries(allUsers).forEach((item) => {
      if (item[0] === e) {
        setAppliedStudent(item[1]);
        setShowModal(true);
      }
    });
  };

  // Rendering the Vacancies component
  return (
    <div style={{ width: '100%', marginTop: '5em' }}>
      {!!showModal && <ReadOnlyModal data={appliedStudent} onHide={() => setShowModal(false)} ShowModal={showModal} />}
      <div style={{ width: '100%', marginBottom: '5em' }}>
        <h3 className="vacanciesHeading">Latest Vacancies Here</h3>
      </div>
      <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {allJobs &&
          Object.entries(allJobs).map((item) => {
            if (item[1]?.uid === currentUserUid) {
              let tempUser = [];
              if (item[1]?.AppliedStudents) {
                Object.values(item[1]?.AppliedStudents).forEach((appliedItem) => {
                  const user = allUsers[appliedItem?.currentUserUid];
                  if (user) {
                    tempUser.push(user);
                  }
                });
              }

              return (
                // Rendering the Cards component for each job vacancy
                <Cards
                  title={item[1].jobTitle}
                  text={item[1].jobDescription}
                  key2="Minimum GPA Required"
                  value2={item[1].min_gpa}
                  key3="Tentative Salary"
                  value3={new Intl.NumberFormat('en-PK', { maximumSignificantDigits: 3 }).format(item[1].salary)}
                  linkText="Delete"
                  clickHandler={() => deleteJob(item[1])}
                  email={item[1].email}
                  footerKey="Last date to apply is"
                  footerValue={item[1].lastDateToApply}
                  dropDownValue={tempUser}
                  dropDownClickHandler={(e) => studentsDropDown(e)}
                />
              );
            }
          })}
      </div>
    </div>
  );
};
