// Importing necessary dependencies
import React, { useState, useEffect } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import firebase from 'firebase';
import './Download.css';

// Defining the Download component
const Download = () => {
  // State to store the list of companies, selected company, and students
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [students, setStudents] = useState([]);

  // Fetching companies from Firebase on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesSnapshot = await firebase.database().ref('Companies').once('value');
        const companiesData = companiesSnapshot.val();

        if (companiesData) {
          // Mapping company data to an array and updating state
          const companiesArray = Object.keys(companiesData).map(companyId => ({
            id: companyId,
            name: companiesData[companyId].fullName,
          }));
          setCompanies(companiesArray);
        }
      } catch (error) {
        console.error('Error fetching companies:', error.message);
      }
    };

    fetchCompanies();
  }, []);

  // Fetching students from Firebase on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsSnapshot = await firebase.database().ref('Students').once('value');
        const studentsData = studentsSnapshot.val();

        if (studentsData) {
          // Mapping student data to an array and updating state
          const studentsArray = Object.keys(studentsData).map(studentId => ({
            id: studentId,
            ...studentsData[studentId],
          }));
          setStudents(studentsArray);
        }
      } catch (error) {
        console.error('Error fetching students:', error.message);
      }
    };

    fetchStudents();
  }, []);

  // Function to download eligible students for a selected company
  const downloadCompanyStudents = (cgpaFilter) => {
    try {
      // Handling case when there is no student data
      if (!students || students.length === 0) {
        console.error('No student data available for download.');
        return;
      }

      // Creating a new workbook
      const workbook = XLSX.utils.book_new();

      // Filtering students based on CGPA and sorting
      const filteredStudents = students
        .filter(student => (parseFloat(student.cgpa) || 0) >= cgpaFilter)
        .sort((a, b) => (parseFloat(b.cgpa) || 0) - (parseFloat(a.cgpa) || 0));

      // Mapping filtered student data
      const companyStudentsData = filteredStudents.map(student => ({
        fullName: student.fullName,
        cgpa: student.cgpa,
        email: student.email,
      }));

      // Creating a worksheet and defining header
      const worksheet = XLSX.utils.json_to_sheet(
        companyStudentsData,
        {
          header: ['fullName', 'cgpa', 'email'],
        }
      );

      // Defining file name
      const fileName = `Eligible_students.xlsx`;

      // Appending worksheet to workbook and writing the file
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered_Students');
      XLSX.writeFile(workbook, fileName);

      console.log(`Students data download successful for CGPA >= ${cgpaFilter}.`);
    } catch (error) {
      console.error(`Error downloading students data for CGPA >= ${cgpaFilter}:`, error.message);
    }
  };

  // Function to download students with low CGPA for a selected company
  const downloadLowCgpaStudents = (cgpaFilter) => {
    try {
      // Handling case when there is no student data
      if (!students || students.length === 0) {
        console.error('No student data available for download.');
        return;
      }

      // Creating a new workbook
      const workbook = XLSX.utils.book_new();

      // Filtering students based on CGPA and sorting
      const filteredStudents = students
        .filter(student => (parseFloat(student.cgpa) || 0) < cgpaFilter)
        .sort((a, b) => (parseFloat(b.cgpa) || 0) - (parseFloat(a.cgpa) || 0));

      // Mapping filtered student data
      const companyStudentsData = filteredStudents.map(student => ({
        fullName: student.fullName,
        cgpa: student.cgpa,
        email: student.email,
      }));

      // Creating a worksheet and defining header
      const worksheet = XLSX.utils.json_to_sheet(
        companyStudentsData,
        {
          header: ['fullName', 'cgpa', 'email'],
        }
      );

      // Defining file name
      const fileName = `Not_eligible_students.xlsx`;

      // Appending worksheet to workbook and writing the file
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered_Students');
      XLSX.writeFile(workbook, fileName);

      console.log(`Students data download successful for CGPA >= ${cgpaFilter}.`);
    } catch (error) {
      console.error(`Error downloading students data for CGPA >= ${cgpaFilter}:`, error.message);
    }
  };

  // Function to download details of all students
  const downloadAllStudents = () => {
    try {
      // Handling case when there is no student data
      if (!students || students.length === 0) {
        console.error('No student data available for download.');
        return;
      }

      // Creating a new workbook
      const workbook = XLSX.utils.book_new();

      // Sorting all students based on CGPA
      const filteredStudents = students
        .sort((a, b) => (parseFloat(b.cgpa) || 0) - (parseFloat(a.cgpa) || 0));

      // Mapping all student data
      const companyStudentsData = filteredStudents.map(student => ({
        fullName: student.fullName,
        cgpa: student.cgpa,
        email: student.email,
      }));

      // Creating a worksheet and defining header
      const worksheet = XLSX.utils.json_to_sheet(
        companyStudentsData,
        {
          header: ['fullName', 'cgpa', 'email'],
        }
      );

      // Defining file name
      const fileName = `All_students.xlsx`;

      // Appending worksheet to workbook and writing the file
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered_Students');
      XLSX.writeFile(workbook, fileName);

      console.log(`Students data download successful`);
    } catch (error) {
      console.error(`Error downloading students data.`, error.message);
    }
  };

  // Rendering the download component
  return (
    <div className="download-container">
      <h2>Download All Student Details</h2>

      {/* Dropdown for selecting a company */}
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {selectedCompany ? selectedCompany.name : 'Select Company'}
        </Dropdown.Toggle>

        {/* Dropdown menu with a list of companies */}
        <Dropdown.Menu>
          {companies.map(company => (
            <Dropdown.Item key={company.id} onClick={() => setSelectedCompany(company)}>
              {company.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Button to download eligible students for the selected company */}
      <div className="center-button">
        <Button variant="primary" onClick={() => downloadCompanyStudents(6)}>
          {selectedCompany ? `Download ${selectedCompany.name}'s Eligible Students Details` : 'Download Selected Company'}
        </Button>
      </div>
      
      {/* Button to download students with low CGPA for the selected company */}
      <div className="center-button">
        <Button variant="primary" onClick={() => downloadLowCgpaStudents(5)}>
          {selectedCompany ? `Download ${selectedCompany.name}'s Not Eligible Students Details` : 'Download Selected Company'}
        </Button>
      </div>

      {/* Button to download details of all students */}
      <div className="center-button">
        <Button variant="primary" onClick={downloadAllStudents}>
          Download All Students Details
        </Button>
      </div>
    </div>
  );
};

// Exporting the Download component
export default Download;
