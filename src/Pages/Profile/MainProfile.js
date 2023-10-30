import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Profile } from './Profile';
import firebase from "firebase";
import { useHistory } from 'react-router';

// Component for the main profile page
export const MainProfile = () => {
    let history = useHistory();
    const state = useSelector(state => state);
    const currentUser = state?.currentUser;
    const [profile, setProfile] = useState(currentUser?.profile || "");

    // Function to submit the profile updates
    const Submit = () => {
        let UID = firebase.auth().currentUser?.uid;

        // Update the user's profile in the database
        firebase.database().ref("Users/" + UID).update({
            profile: profile,
        }).then(() => {
            console.log("Successfully updated profile");
            history.push("/");
        }).catch((e) => console.log("Error while updating profile: ", e));
    };

    // Data for rendering the profile form for both Company and Student roles
    const CompanyData = {
        fields: [
            { "placeholder": "Full Name", "type": "text", "id": "fullName", "value": `${currentUser?.fullName}` },
            { placeholder: "Email", type: "email", value: `${currentUser?.email}` },
            { placeholder: "Brief Profile", type: "textarea", value: `${profile}`, changeHandler: onchange = (e) => setProfile(e.target.value) }
        ],
        onsubmit: () => Submit()
    };

    const StudentData = {
        fields: [
            { "placeholder": "Full Name", "type": "text", "id": "fullName", "value": `${currentUser?.fullName}` },
            { placeholder: "Email", type: "email", value: `${currentUser?.email}` },
            { placeholder: "Brief Profile", type: "textarea", value: `${profile}`, changeHandler: onchange = (e) => setProfile(e.target.value) }
        ],
        onsubmit: () => Submit()
    };

    // Render the Profile component based on the user's role
    return (
        (!currentUser || currentUser) && currentUser["role"] === "Company" ?
            <Profile data={CompanyData} /> :
            currentUser["role"] === "Student" ?
                <Profile data={StudentData} /> :
                alert("Please login first!")
    );
};
