// Importing the createStore function from Redux
import { createStore } from "redux";

// Importing the Reducer and initialState from the Reducer file
import Reducer, { initialState } from "./Reducer";

// Creating the Redux store by passing the Reducer and initialState
export const store = createStore(
    Reducer,         // The Reducer function responsible for state updates
    initialState    // The initial state of the Redux store
);
