import {
    IDENTIFY_USER,
    LOGOUT_USER,
    LOGIN_USER,
    UPDATE_LOGGED_USER,
    USER_AUTH_IN_PROGRESS,
  } from "../types";
  
  let initialState = {
    currentUser: null,
    isAuthInProgress: false,
    isAuthDone: false,
    userType:null
  };
  
  export default function userReducer(state = initialState, action) {
    switch (action.type) {
      case IDENTIFY_USER:
        return action.payload;
      case LOGOUT_USER:
        return action.payload;
      case LOGIN_USER:
        return { ...state, ...action.payload };
      case UPDATE_LOGGED_USER:
        return { ...state, ...action.payload };
      case USER_AUTH_IN_PROGRESS:
        return {
          ...state,
          ...action.payload
        };
      default:
        return state;
    }
  }