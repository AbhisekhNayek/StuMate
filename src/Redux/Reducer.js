// Importing action type constants from ActionTypes.js
import { ALL_USERS, CURRENT_USER, IS_LOADING, ALL_JOBS, APPLIED_JOBS } from './ActionTypes';

// Initial state for the Redux store
export const initialState = {
    currentUser: {},    // Holds the information of the current user
    isLoading: true,    // Indicates whether data is still loading
    allUsers: {},       // Holds information about all users
    allJobs: [],        // Holds information about all jobs
    appliedJobs: []     // Holds information about jobs that the user has applied to
};

// Reducer function to handle state updates based on dispatched actions
export default function Reducer(state = initialState, { type, payload }) {
    switch (type) {
        case CURRENT_USER:
            // Update the current user in the state
            return {
                ...state,
                currentUser: payload
            };

        case IS_LOADING:
            // Update the loading state in the state
            return {
                ...state,
                isLoading: payload
            };

        case ALL_USERS:
            // Update all users in the state
            return {
                ...state,
                allUsers: payload
            };

        case ALL_JOBS:
            // Update all jobs in the state
            return {
                ...state,
                allJobs: payload
            };

        case APPLIED_JOBS:
            // Update applied jobs in the state
            return {
                ...state,
                appliedJobs: [...state.appliedJobs, payload]
            };

        default:
            // Return the current state if the action type is not recognized
            return state;
    }
}
