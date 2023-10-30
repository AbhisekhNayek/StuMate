// Importing necessary dependencies and styles...
import React, { useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useHistory, Link, Route, Switch } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Login.css';
import usePasswordToggler from './useHooks'; // Custom hook for password visibility toggling
import firebase from 'firebase';
import { currentUserAction, isLoadingAction } from '../../Redux/Actions';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../Components/Loader';
import logo from './campus_logo.png';
import ForgotPassword from './ForgotPassword';

// Component for user login
export const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [Icon, inputType] = usePasswordToggler(); // Custom hook for toggling password visibility
  const state = useSelector((state) => state);
  const loading = state?.isLoading;

  // Effect hook to check if the user is already logged in
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase
          .database()
          .ref(`Users/${firebase.auth().currentUser?.uid}/`)
          .on('value', (res) => {
            const userRole = res.val()?.role;

            // Redirect user based on their role
            if (userRole === 'Student') {
              dispatch(currentUserAction(res.val()));
              dispatch(isLoadingAction(false));
              history.push('/companies');
            } else if (userRole === 'Company') {
              dispatch(currentUserAction(res.val()));
              dispatch(isLoadingAction(false));
              history.push('/vacancies');
            } else if (userRole === 'Admin') {
              dispatch(currentUserAction(res.val()));
              dispatch(isLoadingAction(false));
              history.push('/admin');
            } else {
              // Handle other roles or scenarios if needed
            }
          });
      } else {
        dispatch(isLoadingAction(false));
      }
    });
    // eslint-disable-next-line
  }, []);

  // Formik hook for form state management and validation
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Password must be 8 or more than 8 characters Long ')
        .max(18, 'Must be 18 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      let email = values.email;
      let pass = values.password;
      LoginFunc(email, pass);
    },
  });

  // Function to handle user login
  const LoginFunc = (email, pass) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(() => {
        firebase
          .database()
          .ref(`Users/${firebase.auth().currentUser?.uid}/`)
          .on('value', (res) => {
            const userRole = res.val()?.role;

            // Redirect user based on their role
            if (userRole === 'Student') {
              dispatch(currentUserAction(res.val()));
              dispatch(isLoadingAction(false));
              history.push('/companies');
            } else if (userRole === 'Company') {
              dispatch(currentUserAction(res.val()));
              dispatch(isLoadingAction(false));
              history.push('/vacancies');
            } else if (userRole === 'Admin') {
              dispatch(currentUserAction(res.val()));
              dispatch(isLoadingAction(false));
              history.push('/admin');
            } else {
              // Handle other roles or scenarios if needed
            }
          });
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        // Handle authentication errors
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
      });
  };

  // Function to navigate to the signup page
  const SignupFunc = () => {
    history.push('/signup');
  };

  // If loading, show a loader component
  if (loading) return <Loader />;

  // Rendering the Login component
  return (
    <div className="loginMain">
      <h4>Log In To Account</h4>
      <Form onSubmit={formik.handleSubmit} className="LoginForm">
        <img src={logo} className="compLogo" alt="Logo" />
        <Form.Group>
          <Form.Label className="labels" htmlFor="email">
            Email
          </Form.Label>
          <Form.Control id="email" type="email" placeholder="Enter email" {...formik.getFieldProps('email')} autoFocus />
          <span className="inputerror">
            {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
          </span>
        </Form.Group>

        <Form.Group>
          <Form.Label className="labels">Password</Form.Label>
          <InputGroup.Prepend>
            <Form.Control id="password" type={inputType} placeholder="Password" {...formik.getFieldProps('password')} />
            <InputGroup.Text id="inputGroupPrepend" style={{ marginLeft: '-2.5em' }}>
              {Icon}
            </InputGroup.Text>
          </InputGroup.Prepend>
          <span className="inputerror">
            {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
          </span>
        </Form.Group>

        <Form.Group>
          <div className="rememberMeCheckbox">
            <Form.Check type="checkbox" label="Remember me" />
          </div>
        </Form.Group>

        <Button variant="primary" id="signin" type="submit">
          Sign In
        </Button>

        <Button variant="link" id="signup" onClick={SignupFunc}>
          Do not have an account?
        </Button>

        <div className="loginLinks">
          <Link to="/forgot-password" id="forgotPasswordLink">
            Forgot Password?
          </Link>
        </div>
      </Form>

      <Switch>
        <Route
          path="/forgot-password"
          render={() => <ForgotPassword onPasswordResetSuccess={() => history.push('/login')} />}
        />
      </Switch>
    </div>
  );
};
