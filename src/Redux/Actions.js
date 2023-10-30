// ActionTypes.js

// Constants for action types
export const ALL_USERS = 'ALL_USERS';
export const CURRENT_USER = 'CURRENT_USER';
export const IS_LOADING = 'IS_LOADING';
export const ALL_JOBS = 'ALL_JOBS';
export const APPLIED_JOBS = 'APPLIED_JOBS';

// Actions for updating Redux state

// Action to update the current user in the Redux state
export const currentUserAction = (payload) => ({
    type: CURRENT_USER,
    payload
})

// Action to update the loading state in the Redux state
export const isLoadingAction = (payload) => ({
    type: IS_LOADING,
    payload
})

// Action to update all users in the Redux state
export const allUsersAction = (payload) => ({
    type: ALL_USERS,
    payload
})

// Action to update all jobs in the Redux state
export const allJobsAction = (payload) => ({
    type: ALL_JOBS,
    payload
})

// Action to update applied jobs in the Redux state
export const appliedJobsAction = (payload) => ({
    type: APPLIED_JOBS,
    payload
})
