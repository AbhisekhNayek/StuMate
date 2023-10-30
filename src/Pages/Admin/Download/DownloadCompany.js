// Importing necessary dependencies
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import firebase from 'firebase';
import './DownloadCompany.css'; // Importing custom styles

// Defining the DownloadCompany component
const DownloadCompany = () => {
  // State to store the list of companies
  const [companies, setCompanies] = useState([]);

  // Fetching companies from Firebase on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesSnapshot = await firebase.database().ref('Companies').once('value');
        const companiesData = companiesSnapshot.val();

        if (companiesData) {
          // Mapping company data to an array and updating state
          const companiesArray = Object.values(companiesData);
          setCompanies(companiesArray);
        }
      } catch (error) {
        console.error('Error fetching companies:', error.message);
      }
    };

    fetchCompanies();
  }, []);

  // Function to handle Excel download of company details
  const handleDownloadExcel = () => {
    try {
      // Handling case when there is no company data
      if (!companies || companies.length === 0) {
        console.error('No data available for download.');
        return;
      }

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Add a worksheet with the company details
      const worksheet = XLSX.utils.json_to_sheet(
        companies.map(({ companyName, email, otherFields }) => ({
          companyName,
          email,
        })),
        {
          header: ['companyName', 'email'], // Defining header
        }
      );
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Companies');

      // Save the workbook to a file
      XLSX.writeFile(workbook, 'companies.xlsx');

      console.log('File download successful.');
    } catch (error) {
      console.error('Error downloading file:', error.message);
      // You can add additional error handling here (e.g., show a notification to the user)
    }
  };

  // Rendering the download component
  return (
    <div className="download-container">
      <h2>Download Company Details</h2>
      {/* Button to trigger the download of company details */}
      <div className="center-button">
        <Button variant="primary" onClick={handleDownloadExcel}>
          Download
        </Button>
      </div>
    </div>
  );
};

// Exporting the DownloadCompany component
export default DownloadCompany;
