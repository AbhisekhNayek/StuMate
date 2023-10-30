import React from 'react';
import { Button, Form, Nav, Navbar } from 'react-bootstrap';
import { CgLogOut } from 'react-icons/cg';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch } from 'react-redux';
import { currentUserAction, isLoadingAction } from '../../Redux/Actions';
import './Header.css';
import { MyModal } from '../Modal/Modal';

// Header component that displays navigation links, a logout button, and a modal
export const Header = (props) => {
  // State to manage the active path for highlighting the current page in navigation
  let [path, setPath] = React.useState(window.location.pathname.toLowerCase());
  let history = useHistory(); // Access the history object for navigation
  let dispatch = useDispatch(); // Access the Redux dispatch function

  // Function to handle user logout
  const logout = () => {
    firebase.auth().signOut(); // Sign out the user using Firebase authentication
    dispatch(currentUserAction(false)); // Dispatch an action to update the Redux store with the current user status
    dispatch(isLoadingAction(false)); // Dispatch an action to update the Redux store with loading status
    history.push('/'); // Redirect the user to the home page after logout
  };

  return (
    <div>
      {/* Bootstrap Navbar component for the header */}
      <Navbar bg="light" expand="lg" fixed="top">
        {/* Navbar Brand */}
        <Navbar.Brand>
          <h4 className="Headerheading">StuMate - PMS</h4>
        </Navbar.Brand>
        {/* Navbar Toggle Button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navControlerParent" />
        {/* Navbar Collapsible Content */}
        <Navbar.Collapse id="basic-navbar-nav" className="navControlerChild">
          {/* Navigation Links */}
          <Nav className="mr-auto">
            {/* Mapping through the array of navigation data to create links */}
            {Array.isArray(props.Data) &&
              props.Data.map((item, index) => (
                <Link key={index} to={item.route} onClick={() => setPath(item.route)}>
                  &nbsp;
                  {/* Conditional styling based on the active path */}
                  {String(window.location.pathname) === String(item.route) ? (
                    <span style={{ color: '#0C222C', textDecoration: 'none !important', fontWeight: '600' }}>
                      {item.Text}
                    </span>
                  ) : (
                    <span style={{ color: 'black', textDecoration: 'none' }}>{item.Text}</span>
                  )}
                  &nbsp;
                </Link>
              ))}
          </Nav>
          {/* Modal component */}
          <MyModal />
          {/* Logout Button */}
          <Form inline>
            &nbsp;
            {/* Bootstrap Button for logout with an icon */}
            <Button variant="outline-dark" onClick={logout} className="logout">
              <CgLogOut />
              Logout
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
