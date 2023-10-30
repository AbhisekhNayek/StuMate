// Importing necessary dependencies

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import StudentList from './StudentList/StudentList';
import CompanyList from './CompanyList/CompanyList';
import Download from './Download/Download';
import DownloadCompany from './Download/DownloadCompany';
import './Admin.css';

// Functional component representing the admin dashboard
const Admin = () => {
  return (
     // Div container for the admin content
    <div className="admin-content">

{/* Switch component to handle routing within the admin dashboard */}
      <Switch>
        <Route path="/Admin/StudentList" component={StudentList} />
        <Route path="/Admin/CompanyList" component={CompanyList} />
        <Route path="/Admin/Download" component={Download} />
        <Route path="/Admin/DownloadCompany" component={DownloadCompany} />

{/* Redirects for handling default and incorrect routes */}
        <Redirect exact from="/Admin" to="/Admin/CompanyList" />
        <Redirect   from="/Admin" to="/Admin/StudentList" />
        <Redirect  from="/Admin" to="/Download" />
      </Switch>
    </div>
  );
};

// Exporting the Admin component
export default Admin;
