// Import necessary components and styles
import React, { useEffect } from "react";
import './App.css';
import { Signup } from './Pages/Signup/Signup';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { Login } from './Pages/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { Test } from './Test';
import { MainProfile } from './Pages/Profile/MainProfile';
import firebase from "firebase";
import { allJobsAction, allUsersAction, currentUserAction, isLoadingAction } from './Redux/Actions';
import { Header } from "./Components/Header/Header";
import { Loader } from "./Components/Loader";
import { Vacancies } from "./Pages/Company/Vacancies/Vacancies.js";
import { Companies } from "./Pages/Student/Companies/Companies";
import { AllJobs } from "./Pages/Student/AllJobs/AllJobs";
import { AppliedJobs } from "./Pages/Student/Applied_Jobs/AppliedJobs";
import Admin from "./Pages/Admin/Admin";
import ForgotPassword from "./Pages/Login/ForgotPassword";

function App() {
  // Get the state and dispatch function from Redux
  const state = useSelector(state => state)
  const loading = state?.isLoading
  const currentUser = state?.currentUser
  let dispatch = useDispatch()

  // UseEffect to check if the user is logged in
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref(`Users/${firebase.auth().currentUser?.uid}/`).on("value", (res) => {
          dispatch(currentUserAction(res.val()))
          dispatch(isLoadingAction(false))
        })
      } else {
        dispatch(isLoadingAction(false))
      }
    });
    // eslint-disable-next-line
  }, [])

  // UseEffect to fetch all users from Firebase
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref(`Users/`).on("value", (res) => {
          dispatch(allUsersAction(res.val()))
        })
      } else {
        // No user is signed in.
      }
    });
    // eslint-disable-next-line
  }, [])

  // UseEffect to fetch all jobs from Firebase
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref(`Jobs/`).on("value", (res) => {
          dispatch(allJobsAction(res.val()))
        })
      } else {
        // No user is signed in.
      }
    });
    // eslint-disable-next-line
  }, [])

  // Header data based on user role
  let studentHeaderData = [
    { "Text": "Companies", "route": "/companies" },
    { "Text": "All Jobs", "route": "/allJobs" },
    { "Text": "Applied Jobs", "route": "/appliedJobs" },
    { "Text": "Profile", "route": "/Profile" },
  ];

  let companyHeaderData = [
    { "Text": "Vacancies", "route": "/vacancies" },
    { "Text": "Profile", "route": "/profile" },
  ];

  const adminHeaderData = [
    { "Text": "Student List", "route": "/Admin/StudentsList" },
    { "Text": "Company List", "route": "/Admin/CompanyList" },
    { "Text": "Student Data", "route": "/Admin/Download" },
    { "Text": "Company Data", "route": "/Admin/DownloadCompany" },
  ];

  // Condition function to check the user's role
  const roleCond = (param) => currentUser?.role === param;

  // Loading state check and redirect to the login page if not logged in
  if (loading) return <Loader />
  return (
    <>
      {/* BrowserRouter wraps the application */}
      <Router>
        {!loading && !currentUser?.uid ? <Redirect to="/" /> : <></>}
        {/* Main App container */}
        <div className="App">
          {/* Conditional rendering of the Header based on user role */}
          {(currentUser?.uid) && <Header Data={roleCond("Student") ? studentHeaderData : roleCond("Company") ? companyHeaderData : (roleCond("Admin") ? adminHeaderData : <></>)} />}
          {/* Routing for different pages */}
          <Switch>
            {/* Public routes */}
            <Route exact path="/" >  <Login /></Route>
            <Route path="/signup" ><Signup /></Route>
            <Route path="/forgot-password" ><ForgotPassword/></Route>
            {/* Private routes */}
            {(roleCond("Student") || roleCond("Company") || roleCond("Admin") ? <Route exact path="/profile" ><MainProfile /></Route> : <></>)}
            <Route path="/test" ><Test /></Route>
            {(currentUser?.uid) && <Route exact path="/vacancies" ><Vacancies /></Route>}
            {(currentUser?.uid) && <Route path="/companies" ><Companies /></Route>}
            {(currentUser?.uid) && <Route path="/allJobs" ><AllJobs /></Route>}
            {(currentUser?.uid) && <Route path="/appliedJobs" ><AppliedJobs /></Route>}
            {/* Add the route for the Admin component */}
            {(currentUser?.role === 'Admin') && <Route path="/admin" component={Admin} />}
          </Switch>
        </div>
      </Router >
    </>
  );
}

// Exporting the main App component
export default App;
