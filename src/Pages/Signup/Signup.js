// Import necessary libraries
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase';
import './Signup.css';
import logo from './campus_logo.png';
import { useDispatch } from 'react-redux';
import { currentUserAction, isLoadingAction } from '../../Redux/Actions';

// Signup component
export const Signup = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [signuperror, setSignuperror] = useState();
  const [showCompanyDetailsModal, setShowCompanyDetailsModal] = useState(false);
  const today = new Date().toISOString();

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      radioType: 'Student',
      cgpa: '',
      companyName: '', 
      acceptedTerms: false,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().when('radioType', {
        is: 'Student',
        then: Yup.string().max(20, 'Name should be 20 characters or less').required('Full Name is required'),
        otherwise: Yup.string(),
      }),
      companyName: Yup.string().when('radioType', {
        is: 'Company',
        then: Yup.string().required('Company Name is required'),
        otherwise: Yup.string(),
      }),
      email: Yup.string().email('Invalid email address').required('Email is Required'),

      password: Yup.string()
        .min(8, 'Password At least have 8 Characters')
        .max(15, 'Password must be 15 characters or less')
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
          'Example : StrongP@ss123'
        )
        .required('Password is required'),
        
      confirmPassword: Yup.string()
        .max(15, 'Confirm password must be 15 characters or less')
        .required('Required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),

      cgpa: Yup.number().when('radioType', {
        is: 'Student',
        then: Yup.number().required('CGPA is required for students'),
        otherwise: Yup.number(),
      }),
      acceptedTerms: Yup.boolean().required("Kindly accept our terms and conditions to proceed with signup ").oneOf([true], "Accept terms and conditions to proceed"),
    }),
    onSubmit: values => {
      SignupFunc(values);
    },
  });

  // Function to handle user signup
  const SignupFunc = async (values) => {
    try {
      const res = await firebase.auth().createUserWithEmailAndPassword(values.email, values.password);

      const UID = res.user.uid;

      // Add user data to Firebase
      const userData = {
        fullName: values.fullName,
        email: values.email,
        role: values.radioType,
        uid: UID,
        accountCreatedOn: today,
      };

      await firebase.database().ref('Users/' + UID).set(userData);

      // Redirect users based on their role
      if (values.radioType === 'Student') {
        // Add student data to StudentList in the Admin panel
        const studentData = {
          fullName: values.fullName, 
          email: values.email,
          role: values.radioType,
          uid: UID,
          accountCreatedOn: today,
          cgpa: values.cgpa, 
        };
        await firebase.database().ref('Students/' + UID).set(studentData);
      } else if (values.radioType === 'Company') {
        // Add company data to CompanyList in the Admin panel
        const companyData = {
          fullName: values.fullName,
          email: values.email,
          role: values.radioType,
          uid: UID,
          accountCreatedOn: today,
          companyName: values.companyName,
        };
        await firebase.database().ref('Companies/' + UID).set(companyData);

        // Show the company details modal
        setShowCompanyDetailsModal(true);
      }

      // Dispatch actions if needed
      dispatch(currentUserAction(userData));
      dispatch(isLoadingAction(false));

      // Redirect users to login
      history.push('/');
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      setSignuperror(errorMessage);
      console.error(errorCode, 'error code' + errorMessage, 'error message');
    }
  };

  // Function to navigate to login
  const LoginFunc = () => {
    history.push('/');
  };

  return (
    <div className="SignupMain">
      <h4>Sign Up</h4>
      <Form onSubmit={formik.handleSubmit} className="SignupForm">
        <img src={logo} className="compLogo" alt="Logo" />

        <Form.Group>
          <Form.Label className="labels" htmlFor={formik.values.radioType === 'Company' ? 'companyName' : 'fullName'}>
            {formik.values.radioType === 'Company' ? 'Company Name' : 'Full Name'}
          </Form.Label>
          <Form.Control
            id={formik.values.radioType === 'Company' ? 'companyName' : 'fullName'}
            type="text"
            placeholder={`Enter ${formik.values.radioType === 'Company' ? 'Company Name' : 'Full Name'}`}
            {...formik.getFieldProps(formik.values.radioType === 'Company' ? 'companyName' : 'fullName')}
            autoFocus
          />
          <span className="inputerror">
            {formik.touched.fullName && formik.errors.fullName ? <div>{formik.errors.fullName}</div> : null}
            {formik.touched.companyName && formik.errors.companyName ? <div>{formik.errors.companyName}</div> : null}
          </span>
        </Form.Group>

        <Form.Group>
          <Form.Label className="labels" htmlFor="email">Email address</Form.Label>
          <Form.Control
            id="email"
            type="email"
            placeholder="Enter Email Address"
            {...formik.getFieldProps('email')}
            {...formik.handleChange}
            onFocus={() => {
              setSignuperror("");
            }}
          />
          <span className="inputerror">
            {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
            {formik.touched.email && signuperror && signuperror.length ? <div>{signuperror}</div> : null}
          </span>
        </Form.Group>

        <Form.Group>
          <Form.Label className="labels" htmlFor="password">Password</Form.Label>
          <Form.Control id="password" type="password" placeholder="Password" {...formik.getFieldProps('password')} />
          <span className="inputerror">{formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}</span>
        </Form.Group>

        <Form.Group>
          <Form.Label className="labels" htmlFor="confirmPassword">Confirm Password</Form.Label>
          <Form.Control id="confirmPassword" type="password" placeholder="Confirm Password" {...formik.getFieldProps('confirmPassword')} />
          <span className="inputerror">{formik.touched.confirmPassword && formik.errors.confirmPassword ? <div>{formik.errors.confirmPassword}</div> : null}</span>
        </Form.Group>

        <Form.Group style={{ display: "flex" }} {...formik.getFieldProps('radioType')}>
          <Form.Label style={{ marginRight: "1rem" }}>Signup as</Form.Label>
          <Form.Check
            style={{ justifyContent: "flex-start" }}
            type="radio"
            label="Student"
            name="radioType"
            id="Student"
            value="Student"
          />
          <Form.Check
            style={{ marginLeft: "1rem" }}
            type="radio"
            label="Company"
            name="radioType"
            id="Company"
            value="Company"
          />
          <div>
            <br />
            <div className="inputerror" style={{ marginLeft: "-16.5em" }}>
              {formik.touched.radioType && formik.errors.radioType ? <div>{formik.errors.radioType}</div> : null}
            </div>
          </div>
        </Form.Group>

        {/* Add CGPA Form Group */}
        {formik.values.radioType === 'Student' && (
          <Form.Group>
            <Form.Label className="labels" htmlFor="cgpa">CGPA</Form.Label>
            <Form.Control id="cgpa" type="text" placeholder="Enter CGPA" {...formik.getFieldProps('cgpa')} />
            <span className="inputerror">
              {formik.touched.cgpa && formik.errors.cgpa ? <div>{formik.errors.cgpa}</div> : null}
            </span>
          </Form.Group>
        )}

        <Form.Group>
          <div>
            <Form.Check
              style={{ display: "flex", marginTop: "0.199rem" }}
              type="checkbox"
              label="I hereby agree all terms of services "
              {...formik.getFieldProps('acceptedTerms')}
            />
            <span className="inputerror">
              {formik.touched.acceptedTerms && formik.errors.acceptedTerms ? <div>{formik.errors.acceptedTerms}</div> : null}
            </span>
          </div>
        </Form.Group>

        <Button variant="primary" id='submit' type="submit"> Sign up</Button>
        <Button variant="link" id='already' type="button" onClick={LoginFunc}>Already have an account ?</Button>
      </Form>

      {/* Add a Modal for Company Details */}
      <Modal show={showCompanyDetailsModal} onHide={() => setShowCompanyDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Company Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add details you want to display for the company */}
          <p>This is additional information for the company.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCompanyDetailsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowCompanyDetailsModal(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
